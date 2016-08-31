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
                var task  = tasks.filter(function(t){
                    return t._id == taskId;
                })[0];
                var title = task.title;
                var description = task.description;
                var deadline = moment(task.deadline).format('LL');
                var resources = task.resources;
                var progress = task.progress;
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .taskDescription').html(description);
                modal.find('.modal-body .taskDeadline').html(deadline);
                modal.find('.modal-body .taskResources').html((resources.length)>0?_this.resourcesAsList(resources): "no resources");
                modal.find('.modal-body .taskProgress').html(progress.toString() + "&percnt;");
            });

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
                                $('#'+id).addClass('animated fadeOut').remove();
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

            $('.checkSubmissions').on('click', function(ev){
                var id = $(ev.target).closest('.taskElement').attr('id');
                Sammy(function(){
                    this.trigger('load-all-submission', {id:id});
                });
            })
        });
    }

    showAllStudentTasks(container, tasks){
        var _this = this;
        var username = sessionStorage['username'];
        this.showUserMenu();
        $.get('templates/student-views/tasks.html', function(templ){
            var rendered = Mustache.render(templ, {username: username, tasks: tasks});
            $(container).html(rendered);

            $('#submissionPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var taskId = $(button).closest('.taskElement').attr('id');
                var task = tasks.filter(function(t){
                    return t._id === taskId;
                })[0];
                var title = task.submission._obj.title;
                var body  = task.submission._obj.content;
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .submissionContent').html(body);
            });
        });
    }

    showEditTaskPage(container, task){
        var _this = this;
        this.showUserMenu();
        var resources = task.resources;
        $.get('templates/teacher-views/edit-task.html', function(template){
            var rendered = Mustache.render(template, task);
            $(container).html(rendered);

            //datepicker
            var today = new Date();
            $(function(){
                $('.date').datepicker({
                    format:"MM d, yyyy",
                    startDate: today,
                    autoclose: true,
                    todayHighlight: true,
                    //language: 'bg',
                    orientation: 'auto'
                });
            });

            $("#addUrl").on('click', function(){
                var linkField = $("#resource");
                var link = linkField.val();
                var pattern = /(www\.|http:\/\/|https:\/\/)[\w]+/;
                if(pattern.test(link)){
                    //add resource to task
                    resources.push(link);

                    $('#resourceList-ul').append('<li class="animated fadeIn padding-bottom-5">' +
                    '<span class="glyphicon glyphicon-link"></span>' +
                    '&nbsp;<a href="'+link+'" target="_blank">'+link+'</a>&nbsp;' +
                    '<button type="button" class="btn btn-default btn-xs removeUrl">' +
                    '<span class="glyphicon glyphicon-remove"></span>' +
                    '</button>' +
                    '</li>');

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

                $('.removeUrl').on('click', function(e){
                    e.preventDefault();
                    var removeUrl = $(e.target).prev().html();
                    resources = resources.filter(function(url){
                        return url !== removeUrl;
                    });
                    $(e.target).closest('li').addClass('animated fadeOut');
                    $(e.target).closest('li').remove();
                });
            });

            $('.removeUrl').on('click', function(e){
                e.preventDefault();
                var removeUrl = $(e.target).prev().html();
                resources = resources.filter(function(url){
                    return url !== removeUrl;
                });
                $(e.target).closest('li').addClass('animated fadeOut');
                $(e.target).closest('li').remove();
            });

            $('#taskPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                var title = $("#title").val();
                var description = $("#description").val();
                var deadline = $("#deadline").val();
                //var resources = resources;
                var progress = task.progress;
                var modal = $(this);
                modal.find('.modal-title').text(title ? title : "no title");
                modal.find('.modal-body .taskDescription').html(description ? description : "no description");
                modal.find('.modal-body .taskDeadline').html(deadline ? deadline : "no deadline");
                modal.find('.modal-body .taskResources').html((resources.length)>0?_this.resourcesAsList(resources): "no resources");
                modal.find('.modal-body .taskProgress').html(progress.toString() + "&percnt;");
            });

            $('#saveChangesToTask').on('click', function(){
                var title = $("#title").val();
                var description = $("#description").val();
                var deadline = $("#deadline").val();

                if(title && description && deadline){
                    task.title = title;
                    task.description = description;
                    task.deadline = new Date(deadline).setHours(3);
                    task.deadline = new Date(task.deadline);
                    task.resources = resources;

                    Sammy(function(){
                        this.trigger('save-changes-to-task', task);
                    });
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
            //datepicker
            var today = new Date();

            $(function(){
                $('.date').datepicker({
                    format:"MM d, yyyy",
                    startDate: today,
                    autoclose: true,
                    todayHighlight: true,
                    //language: 'en',
                    orientation: 'auto'
                });
            });

            //task object
            var data = {
                resources: [],
                students: [],
                progress : 0,
                students : [],
                submissions : []
            };


            $('#addUrl').on('click',function(){
                var linkField = $("#resource");
                var link = linkField.val();
                var pattern = /(www\.|http:\/\/|https:\/\/)[\w]+/;
                if(pattern.test(link)){

                    data.resources.push(link);

                    $('#addedResources').append('<li class="animated fadeIn padding-bottom-5">' +
                        '<span class="glyphicon glyphicon-link"></span>' +
                        '&nbsp;<a href="'+link+'">'+link+'</a>&nbsp;' +
                        '<button type="button" class="btn btn-default btn-xs removeUrl">' +
                        '<span class="glyphicon glyphicon-remove"></span>' +
                        '</button>' +
                        '</li>');

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

                $('.removeUrl').on('click', function(e){
                    e.preventDefault();
                    var removeUrl = $(e.target).prev().attr('href');
                    data.resources = data.resources.filter(function(url){
                        return url !== removeUrl;
                    });
                    $(e.target).closest('li').addClass('animated fadeOut');
                    $(e.target).closest('li').remove();
                });
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

            $('#saveTask').click(function(){
                var descriptionArea = $("#description");
                data.title = $("#title").val();
                data.description = descriptionArea.val();
                //date
                data.deadline = new Date($('#deadline').val()).setHours(3);
                data.deadline = new Date(data.deadline);
                data._acl = {
                    "gr": true,
                    "gw": true
                };
                data.author = 	{
                    "_type":"KinveyRef",
                    "_id": sessionStorage['userId'],
                    "_collection":"user"
                }

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

    showCheckSubmissionsPage(container, data){
        this.showUserMenu();
        console.log(data);
        $.get('templates/teacher-views/check-submissions.html', function(template){
            var rendered = Mustache.render(template, data);
            $(container).html(rendered);

            $('#submissionPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var title = $(button).closest(".submissionInfo").attr("data-submission-title");
                var body = $(button).closest(".submissionInfo").attr("data-submission-content");
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .submissionContent').html(body);
            });


        });
    }

    clearFormFields(){
        $('input').val('');
        $('textarea').val('');
        $('select').val('default');
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
        Sammy(function(){
            this.trigger('show-user-menu');
        });
    }

};