var app = app || {};

app.taskView = class TaskView{
    constructor(){
    }

    showAllTeacherTasks(container, tasks){
        var _this = this;
        var username = sessionStorage['username'];
        this.showUserMenu();
        tasks.forEach(function(t){
            _this.updateTaskProgress(t);
        })
        $.get('templates/teacher-views/tasks.html', function(templ){
            var rendered = Mustache.render(templ, {username: username, tasks: tasks});
            $(container).html(rendered);

            $('#taskPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                var taskId = $(button).closest('.taskElement').attr('id');
                var task  = tasks.filter(function(t){
                    return t._id == taskId;
                })[0];
                console.log(tasks);
                var title = task.title;
                var description = task.description;
                var deadline = task.deadline;
                var resources = task.resources;
                var progress = task.progress;
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .taskDescription').html(description);
                modal.find('.modal-body .taskDeadline').html(deadline);
                modal.find('.modal-body .taskResources').html((resources.length)>0?_this.resourcesAsList(resources): "no resources");
                modal.find('.modal-body .taskProgress').html(progress.toString() + "&percnt;");
            });

            //TODO assign

            //TODO edit
            $('.editTaskBtn').on('click', function(e){
                var url = $(e.target).attr('href');
                Sammy(function(){
                    this.trigger("redirectUrl", {url: url});
                });
            });

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
        var _this = this;
        this.showUserMenu();
        this.updateTaskProgress(task);
        $.get('templates/teacher-views/edit-task.html', function(template){
            var rendered = Mustache.render(template, task);
            $(container).html(rendered);

            $("#addStudents").on("click", function(){
                //TODO when students are added
                //$(students list).append(username);
                //task.students.push({kinvey ref})
                // _this.updateTaskProgress(task);
            });

            $("#addUrl").on('click', function(){
                var linkField = $("#resource");
                var link = linkField.val();
                var pattern = /(www\.|http:\/\/|https:\/\/)[\w]+/;
                if(pattern.test(link)){
                    //add resource to task
                    task.resources.push(link);

                    $('#resourceList-ul').append('<li><span class="glyphicon glyphicon-link"></span>&nbsp;<a href="'+link+'">'+link+'</a></li>');
                    noty({
                        layout: 'topLeft',
                        theme: "bootstrapTheme",
                        type: 'success',
                        text: "Successfully added a link to your resources!",
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

            $('#taskPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                var title = $("#title").val();
                var description = $("#description").val();
                var deadline = $("#deadline").val();
                var resources = task.resources;
                var progress = task.progress;
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .taskDescription').html(description);
                modal.find('.modal-body .taskDeadline').html(deadline);
                modal.find('.modal-body .taskResources').html((resources.length)>0?_this.resourcesAsList(resources): "no resources");
                modal.find('.modal-body .taskProgress').html(progress.toString() + "&percnt;");
            });

            $('#saveChangesToTask').on('click', function(){
                var title = $("#title").val();
                var description = $("#description").val();
                var deadline = $("#deadline").val();
                var resources = task.resources;
                var students = task.students;

                if(title && description && deadline){
                    task.title = title;
                    task.description = description;
                    task.deadline = deadline;
                    console.log(task);
                    //Sammy(funciton(){
                    //    this.trigger('save-changes-to-task', task);
                    //});
                }else{
                    noty({
                        layout: 'topLeft',
                        theme: "bootstrapTheme",
                        type: 'error',
                        text: "Please fill in all required fields correctly!",
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
        });
    }

    showCreateNewTaskPage(container){
        var _this = this;
        var username = sessionStorage['username'];
        this.showUserMenu();
        $.get('templates/teacher-views/create-task.html', function(template){
            $(container).html(template);
            var today = new Date();

            //task object
            var data = {
                resources: [],
                students: [],
                progress : 0,
                students : [],
                submissions : []
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
            //TODO
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
                modal.find('.modal-body .taskDeadline').text(deadline);
                modal.find('.modal-body .taskResources').html(((resources.length)> 0? _this.resourcesAsList(resources) : "no resources"));
                modal.find('.modal-body .taskStudents').html(((students.length)> 0? _this.studentssAsList(resources) : "no students"));
            });

            $('#addTask').click(function(){
                var descriptionArea = $("#description");
                data.title = $("#title").val();
                data.description = descriptionArea.val();
                data.deadline = $("#deadline").val();

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

    updateTaskProgress(task){
        if (task.students.length > 0){
            task.progress = (task.submissions.length / task.students.length)*100;
        }
        return task;
    }


    //in modal
    resourcesAsList(array){
        var htmlElement = "";
        array.forEach(l =>
            htmlElement += "<a href='" + l + "' target='_blank'>" + l +"</a></br>"
        );
        return htmlElement;
    }

    studentsAsList(array){
        var htmlElement = "<ul>";
        array.forEach(s => htmlElement += "<li>" + s.username + "</li>");
        htmlElement+= "</ul>";
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