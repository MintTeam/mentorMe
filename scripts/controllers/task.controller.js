var app = app || {};

app.taskController = class TaskController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadCreateNewTaskPage(container){
        this.view.showCreateNewTaskPage(container);
    }

    //loadAllTeacherTasks(container){
    //    var id = sessionStorage['userId'];
    //    var _this = this;
    //    return this.model.getAllTeacherTasks(id)
    //        .then(function(data){
    //            var sorted = data.sort(function(a,b){
    //                return a.deadline > b.deadline;
    //            });
    //            _this.view.showAllTeacherTasks(container, sorted);
    //        }).done();
    //};
    //
    //loadAllStudentTasks(container){
    //    var id = sessionStorage['userId'];
    //    console.log('ctrl   '+ id);
    //    return this.model.getAllStudentTasks(id)
    //        .then(function(success){
    //            console.log("contr");
    //        }, function(error){
    //            console.error(error);
    //        }).done();
    //}

    loadAllUserTasks(container, type){
        var _this = this;
        var id = sessionStorage['userId'];
        return this.model.getAllUserTasks(id, type)
            .then(function(data){
                var sorted = data.sort(function(a,b){
                    return a.deadline > b.deadline;
                });
                console.log(data);
                if(type === 'teacher'){
                    _this.view.showAllTeacherTasks(container, sorted);
                }else if(type === 'student'){
                    _this.view.showAllStudentTasks(container, sorted);
                    //load all user submissions
                }
            }).done();
    }

    loadEditTaskPage(container, id){
        var _this = this;
        return this.model.getTaskById(id, true)
            .then(function(task){
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

    loadTaskPage(id){
        var _this = this;
        return this.model.getTaskById(id, true)
            .then(function(assignment){
                _this.view.showTaskPage(assignment);
            }).done();
    };

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
                Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/tasks/"});
                });
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

    loadAllStudentTasks(container){
        //TODO
    }
}