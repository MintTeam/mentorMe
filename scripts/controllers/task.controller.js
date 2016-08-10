var app = app || {};

app.taskController = class TaskController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadCreateNewTaskPage(container){
        this.view.showCreateNewTaskPage(container);
    }

    loadEditTaskHomePage(container, id){
        var _this = this;
        return this.model.getTaskById(id)
            .then(function(task){
                _this.view.showEditTaskPage(container, task);
            }).done();
    }

    loadTaskPage(id){
        var _this = this;
        return this.model.getTaskById(id)
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
                    text: "Successfully created an assignment!",
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
                    this.trigger('redirectUrl', {url: "#/tasks/"});
                })
            }).done();
    };

    assignTask(){
        //TODO teachers only
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

    loadAllTeacherTasks(container){
        var id = sessionStorage['userId'];
        var _this = this;
        return this.model.getAllTeacherTasks(id)
            .then(function(data){
                var sorted = data.sort(function(a,b){
                    return a.deadline > b.deadline;
                });
                _this.view.showAllTeacherTasks(container, sorted);
            }).done();
    };

    loadAllStudentTasks(container){
        //TODO
    }
}