var app = app || {};

app.taskView = class TaskView{
    constructor(){
    }

    showAllTeacherTasks(menu, container, tasks){
        var username = sessionStorage['username'];
        $.get('templates/menus/menu-teacher.html', function(template){
            $(menu).html(template);
        });
        $.get('templates/teacher-views/tasks.html', function(templ){
            var rendered = Mustache.render(templ, {username: username, tasks: tasks});
            $(container).html(rendered);

            //$('.viewTaskBtn').on('click', function(ev){
            //    var id = $(ev.target).parent().parent().parent().attr('id');
            //    var task = tasks.filter(function(a){
            //        return a._id == id;
            //    })[0];
            //
            //    var selector= "#preview";
            //    $.get('templates/teacher-views/view-task.html', function(template){
            //        var rendered = Mustache.render(template, task);
            //        $(selector).html(rendered);
            //    })
            //});

            $('#taskPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                var taskId = $(button).parent().parent().parent().attr('id');
                var task  = tasks.filter( t => t._id == taskId )[0];
                var title = task.title;
                var description = task.description;
                var deadline = task.deadline;
                var resources = task.resources;
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .taskDescription').html("<strong>Description: </strong>" + description);
                modal.find('.modal-body .taskDeadline').html("<strong>Deadline: </strong>" + deadline);
                modal.find('.modal-body .taskResources').html("<strong>Resources: </strong>" + resources);
            });


            $('.deleteTaskBtn').on('click', function(ev){
                var id = $(ev.target).parent().parent().parent().attr('id');
                var task = tasks.filter(function(a){
                    return a._id == id;
                })[0];
                var title = task.title;
                var description = task.description;
                var deadline = task.deadline;

                noty({
                    layout: 'topLeft',
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

    showCreateNewTaskPage(menu, container){
        var _this = this;
        var username = sessionStorage['username'];
        $.get('templates/menus/menu-teacher.html', function(template){
            $(menu).html(template);
        });

        $.get('templates/teacher-views/create-task.html', function(template){
            $(container).html(template);
            var today = new Date();
            var data = {
                resources: []
            };

            $(function(){
                $('.date').datepicker({
                    format:"dd-mm-yyyy",
                    startDate: today,
                    autoclose: true,
                    todayHighlight: true,
                    language: 'bg'
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

            $('#previewTask').click(function(){
                var descriptionArea = $("#description");
                data.title = $("#title").val();
                data.description = descriptionArea.val();
                data.deadline = $("#deadline").val();
                var selector= "#preview";

                $.get('templates/teacher-views/view-task.html', function(template){
                    var rendered = Mustache.render(template, data);
                    $(selector).html(rendered);
                })
            });

            $('#addTask').click(function(){
                var descriptionArea = $("#description");
                data.title = $("#title").val();
                data.description = descriptionArea.val();
                data.deadline = $("#deadline").val();
                data.assigned = false;
                data.hasSubmissions = false;
                data.submissionsCount = 0;
                //TODO substitute the above with data.submissions = []

                if(data.title && data.description && data.deadline){
                    Sammy(function(){
                        this.trigger('create-task', data);
                    });
                }else{
                    noty({
                        layout: 'topLeft',
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

    showTaskPage(data){
        var selector= "#preview";
        console.log(data.title);
        $.get('templates/teacher-views/view-task.html', function(template){
            var rendered = Mustache.render(template, data);
            $(selector).html(rendered);
        })
    }

    clearFormFields(){
        $('input').val('');
        $('textarea').val('');
        $('select').val('default');
    }

    resourcesAsList(){

    }
};