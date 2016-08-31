var app = app || {};

app.taskController = class TaskController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadCreateNewTaskPage(container){
        this.view.showCreateNewTaskPage(container);
    }

    loadAllUserTasks(container, type){
        var _this = this;
        var id = sessionStorage['userId'];
        return this.model.getAllUserTasks(id, type)
            .then(function(data){
                var now = new Date();
                var sorted = data.sort(sortByDate);
                sorted.forEach(function(task){
                    var deadline = new Date(task.deadline);
                    deadline.setHours(23, 59);
                    if(deadline.getTime() <= now.getTime()){
                        task["over"] = true;
                    }
                    task.deadline = moment(task.deadline).format('LL');
                });
                if(type === 'teacher'){
                    _this.view.showAllTeacherTasks(container, sorted);
                }else if(type === 'student'){
                    var studentTasks = [];

                    sorted.forEach(function(task){
                        var submissionTitle = "";
                        var submissionContent = "";
                        var taskEntry = {
                            _id: task._id,
                            title: task.title,
                            description: task.description,
                            author: task.author._obj.username,
                            resources: task.resources,
                            over: task.over,
                            deadline: task.deadline,
                            submission: task.submissions.filter(function(subm){
                                return subm._obj._acl.creator == id;
                            })[0]
                        };
                        studentTasks.push(taskEntry);
                    })
                    _this.view.showAllStudentTasks(container, studentTasks);
                }
            }).done();

        function sortByDate(taskA, taskB){
            return taskA.deadline > taskB.deadline;
        }
    }

    loadTopUserTasks(type){
        var output = [];
        var _this = this;
        var userId = sessionStorage['userId'];
        return this.model.getTopUserTasks(userId, type)
            .then(function(tasks){
                var now = new Date();
                tasks.forEach(function(task){
                    var deadline = new Date(task.deadline);
                    deadline.setHours(23, 59);
                    if(deadline.getTime() > now.getTime()){
                        task.deadline = moment(task.deadline).format('LL');
                        output.push(task);
                    }
                });
                return output;
            });
    }

    loadEditTaskPage(container, id){
        var _this = this;
        return this.model.getTaskById(id)
            .then(function(task){
                task.deadline = moment(task.deadline).format('LL');
                _this.view.showEditTaskPage(container, task);
            }).done();
    }

    saveChangesToTask(task){
        task = this.updateTaskProgress(task);
        return this.model.editTask(task)
            .then(function(success){
                Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/tasks/"});
                });
            }).done();
    }

    loadTaskInfo(id){
        return this.model.getTaskById(id);
    }

    checkSubmissions(container, taskId){
        var _this = this;
        return this.model.getTaskById(taskId, true)
            .then(function(task){
                var studentSubmissionPairs = [];
                task.students.forEach(function(student){
                    var studentId = student._id;
                    var username = student._obj.username;
                    var firstName = student._obj.firstName;
                    var lastName = student._obj.lastName;
                    task.submissions.forEach(function(submission){
                        if(submission._obj.author._id === studentId){
                            studentSubmissionPairs.push({
                                "username": username,
                                "firstName": firstName,
                                "lastName": lastName,
                                "submission": {
                                    title: submission._obj.title,
                                    content: submission._obj.content
                                }
                            });
                        }else{
                            studentSubmissionPairs.push({
                                "username": username,
                                "firstName": firstName,
                                "lastName": lastName
                            });
                        }
                    });
                })
                var sortedSubmissionsByUsername = studentSubmissionPairs.sort(function(a,b){
                   return a.submission > b.submission;
                });

                var data = {
                    taskInfo: {
                        title: task.title,
                        description: task.description,
                        id: task._id
                    },
                    submissions: sortedSubmissionsByUsername
                };
                _this.view.showCheckSubmissionsPage(container, data)
            })
    }

    addSubmissionToTask(taskId, submissionId){
        var _this = this;
        return this.model.getTaskById(taskId)
            .then(function(task){
                task.submissions.push({
                        "_type":"KinveyRef",
                        "_id":submissionId,
                        "_collection":"submissions"
                    });
                task = _this.updateTaskProgress(task);
                return _this.model.editTask(task)
                    .then(function(success){
                        noty({
                            layout: 'topLeft',
                            theme: "bootstrapTheme",
                            type: 'success',
                            text: "Successful submission!",
                            dismissQueue: true,
                            animation: {
                        		open: {height: 'toggle'},
                        		close: {height: 'toggle'},
                        		easing: 'swing',
                        		speed: 500
                            },
                            timeout: 800
                        });
                        Sammy(function(){
                           this.trigger('redirectUrl', {url: "#/tasks/"});
                        });
                    })
            }).done();
    }

    createTask(data){
        var _this = this;
        return this.model.postTask(data)
            .then(function(success){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successfully created a task!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });
                _this.view.clearFormFields();

                Sammy(function(){
                    this.trigger('add-to-task-collection', {id:success._id});
                })
                Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/tasks/"});
                });
            }).done();
    };

    assignTask(studentsIds, taskId) {
        var _this = this;

        return this.model.getTaskById(taskId)
            .then(function(task){
                var students = task.students;
                $.each(studentsIds, function(index, id){
                    if(!(_.findWhere(task.students, {_id: id}))){
                        task.students.push({
                            "_type":"KinveyRef",
                            "_id": id,
                            "_collection":"user"
                        });
                    }
                });
                task = _this.updateTaskProgress(task);
                return _this.model.editTask(task)
                    .then(function(success){
                        noty({
                            layout: 'topLeft',
                            theme: "bootstrapTheme",
                            type: 'success',
                            text: "You successfully assigned the task!" ,
                            dismissQueue: true,
                            animation: {
                        		open: {height: 'toggle'},
                        		close: {height: 'toggle'},
                        		easing: 'swing',
                        		speed: 500
                            },
                            timeout: 800
                        });

                        Sammy(function(){
                            this.trigger('redirectUrl', {url: "#/tasks/"});
                        });
                    }).done();
            }).done();

    }

    deleteTaskById(id){
        //teacher only
        var taskRow = "tr#" + id;
        var _this = this;
        return this.model.deleteTask(id)
            .then(function(success){
                $(taskRow).remove();
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successfully deleted an assignment!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });
                //Sammy(function(){
                //    this.trigger('redirectUrl', {url: "#/tasks/"});
                //});
            }, function(error){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'error',
                    text: "Couldn't delete the assignment!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });
            }).done();
    };

    updateTaskProgress(task){
        if (task.students && task.students.length > 0) {
            task.progress = Math.round((task.submissions.length / task.students.length) * 100);
        }
        return task;
    }
}