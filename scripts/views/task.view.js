var app = app || {};

app.taskView = class TaskView{
    constructor(){
    }

    showAllTeacherTasks(container, tasks){
        var _this = this;
        var username = sessionStorage['username'];
        this.showUserMenu();
        $.get('templates/teacher-views/tasks.html', function(templ){
            var rendered = Mustache.render(templ, {username: username, tasks: tasks});
            $(container).html(rendered);

            $('#taskPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                var taskId = $(button).closest('.taskElement').attr('id');
                var task  = tasks.filter( t => t._id == taskId )[0];
                var title = task.title;
                var description = task.description;
                var deadline = task.deadline;
                var resources = task.resources;
                var progress = 0;
                if (task.students.length > 0){
                    progress = (task.submissions.length / task.students.length)*100;
                }
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .taskDescription').html(description);
                modal.find('.modal-body .taskDeadline').html(deadline);
                modal.find('.modal-body .taskResources').html((resources.length)>0?_this.resourcesAsList(resources): "no resources");
                modal.find('.modal-body .taskProgress').html(progress + "%");
            });

            //TODO assign
            //TODO edit
            $('.editTaskBtn').on('click', function(ev){
                var id = $(ev.target).closest('.taskElement').attr('id');

                Sammy(function(){
                    this.trigger('load-edit-task-page', {id:id});
                })
            })


            $('.deleteTaskBtn').on('click', function(ev){
                var id = $(ev.target).closest('.taskElement').attr('id');
                var task = tasks.filter(function(a){
                    return a._id == id;
                })[0];
                var title = task.title;
                var description = task.description;
                var deadline = task.deadline;

                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'confirm',
                    text: "Are you sure you want to delete task with Title: <strong>"
                    + title + "</strong><br>Description: <strong>" + description + "</strong><br>Deadline: <strong>" + deadline + "</strong>?",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    buttons: [
                        {
                            addClass: 'btn btn-primary', text: 'Yes', onClick: function($noty) {
                                Sammy(function(){
                                    this.trigger('delete-task', {id: id});
                                });

                                $noty.close();
                            }
                        },
                        {
                            addClass: 'btn btn-danger', text: 'No', onClick: function($noty) {
                                $noty.close();
                            }
                        }
                    ]
                });
            });
        });
    }

    showEditTaskPage(container, task){
        $.get('templates/teacher-views/edit-task.html', function(template){
            var rendered = Mustache.render(template, {task: task});
            $(container).html(rendered);
        });
    }


    showCreateNewTaskPage(container){
        var _this = this;
        var username = sessionStorage['username'];
        this.showUserMenu();
        $.get('templates/teacher-views/create-task.html', function(template){
            $(container).html(template);
            var today = new Date();
            var data = {
                resources: [],
                students: []
            };

            $(function(){
                $('.date').datepicker({
                    format:"dd-mm-yyyy",
                    startDate: today,
                    autoclose: true,
                    todayHighlight: true,
                    language: 'bg',
                    orientation: 'auto'
                });
            });

            $('#addUrl').on('click',function(){
                var linkField = $("#resource");
                var link = linkField.val();
                var pattern = /(www\.|http:\/\/|https:\/\/)[\w]+/;
                if(pattern.test(link)){
                    data.resources.push(link);
                    noty({
                        layout: 'topLeft',
                        theme: "bootstrapTheme",
                        type: 'success',
                        text: "Successfully added a link!",
                        dismissQueue: true,
                        animation: {
                            open: {height: 'toggle'},
                            close: {height: 'toggle'},
                            easing: 'swing',
                            speed: 500
                        },
                        timeout: 500
                    });
                    linkField.val('');
                }else{
                    linkField.addClass('has-error');
                    noty({
                        layout: 'topLeft',
                        theme: "bootstrapTheme",
                        type: 'error',
                        text: "The input doesn't look like a link!",
                        dismissQueue: true,
                        animation: {
                            open: {height: 'toggle'},
                            close: {height: 'toggle'},
                            easing: 'swing',
                            speed: 500
                        },
                        timeout: 500
                    });
                }
            });

            $('#addStudent').on('click', function(){

            });

            $('#taskPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                var descriptionArea = $("#description");
                var title = $("#title").val() || 'no title';
                var description  =  descriptionArea.val() || 'no description';
                var deadline = $("#deadline").val() || 'no deadline specified';
                var resources = data.resources;
                var students = data.students;
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .taskDescription').html(description);
                modal.find('.modal-body .taskDeadline').html(deadline);
                modal.find('.modal-body .taskResources').html(((resources.length)> 0? _this.resourcesAsList(resources) : "no resources"));
                modal.find('.modal-body .taskStudents').html(((students.length)> 0? _this.studentssAsList(resources) : "no students"));
            });

            $('#addTask').click(function(){
                var descriptionArea = $("#description");
                data.title = $("#title").val();
                data.description = descriptionArea.val();
                data.deadline = $("#deadline").val();
                data.students = [];
                data.submissions = [];

                if(data.title && data.description && data.deadline){
                    Sammy(function(){
                        this.trigger('create-task', data);
                    });
                }else{
                    noty({
                        layout: 'topLeft',
                        theme: "bootstrapTheme",
                        type: 'error',
                        text: "Please fill in all required fields!",
                        dismissQueue: true,
                        animation: {
                            open: {height: 'toggle'},
                            close: {height: 'toggle'},
                            easing: 'swing',
                            speed: 500
                        },
                        timeout: 500
                    });
                }
            });

            $('#clearForm').click(function(){
                _this.clearFormFields();
            })
        })
    }

    clearFormFields(){
        $('input').val('');
        $('textarea').val('');
        $('select').val('default');
    }

    resourcesAsList(array){
        var htmlElement = "";
        array.forEach(l =>
            htmlElement += "<a href='" + l + "' target='_blank'>" + l +"</a>&NewLine;"
        );
        return htmlElement;
    }

    studentsAsList(array){
        var htmlElement = "";
        array.forEach(s => htmlElement += s + "&NewLine;");
        return htmlElement;
    }

    showUserMenu(){
        $('#loginMenuLink').hide();
        $('#registerMenuLink').hide();
        $('#tasksMenuLink').show();
        $('#studentsMenuLink').show();
        $('#teamsMenuLink').show();
        $('#blogMenuLink').show();
        $('#logoutMenuLink').show();
    }

};