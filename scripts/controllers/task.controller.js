var app = app || {};

app.taskController = class TaskController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadCreateNewTaskPage(menu, container){
        this.view.showCreateNewTaskPage(menu, container);
    }

    loadTaskPage(id){
        var _this = this;
        return this.model.getTaskById(id)
            .then(function(assignment){
                _this.view.showTaskPage(assignment);
            })
    };

    createTask(data){
        var _this = this;
        return this.model.postTask(data)
            .then(function(success){
                noty({
                    layout: 'topLeft',
                    type: 'success',
                    text: "Successfully created an assignment!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });
                _this.view.clearFormFields();
            });
    };

    assignTask(){
        //TODO teacher only
    };

    deleteTaskById(id){
        //teacher only
        var taskRow = "tr#" + id;
        var _this = this;
        return this.model.deleteTask(id)
            .then(function(success){
                $(taskRow).remove();
                noty({
                    layout: 'topLeft',
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
            }, function(error){
                console.error(error);
            });
    };

    loadAllTeacherTasks(menu, container){
        var id = sessionStorage['userId'];
        var _this = this;
        return this.model.getAllTeacherTasks(id)
            .then(function(data){
                var sorted = data.sort(function(a,b){
                    return a.deadline > b.deadline;
                });
                _this.view.showAllTeacherTasks(menu, container, sorted);
            })
    };

    loadAllStudentTasks(menu, container){
        //TODO
    }
}