var app = app || {};

app.submissionView = class SubmissionView{
    constructor(){
    }

    showCreateNewSubmissionPage(container, task){
        var _this = this;
        this.showUserMenu();
        $.get('templates/student-views/create-submission.html', function(template){
            var rendered = Mustache.render(template, task);
            $(container).html(rendered);

            $('#sendSubmission').on('click', function(){
                var title = $('#title').val();
                var content = $('#content').val();

                if(title && content){

                    var submission = {
                        title : title,
                        content : content,
                        task: {
                            "_type":"KinveyRef",
                            "_id": task.id,
                            "_collection":"tasks"
                        },
                        author: {
                            "_type":"KinveyRef",
                            "_id": sessionStorage['userId'],
                            "_collection":"user"
                        }
                    };

                    Sammy(function(){
                        this.trigger('send-submission', submission);
                    })
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
            })

            $('#submissionPreview').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var title = $("#title").val() || 'no title';
                var body  = $('#content').val() || 'no content';
                var modal = $(this);
                modal.find('.modal-title').text(title);
                modal.find('.modal-body .submissionContent').html(body);
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

    showUserMenu(){
        Sammy(function(){
            this.trigger('show-user-menu');
        });
        //var username = sessionStorage['username'];
        //var usertype = sessionStorage['userType'];
        //$('#loggedUserInfo a').html('<img src="img/vc-logo.png">'+username + ", " + usertype);
        //$('#loginMenuLink').hi1de();
        //$('#registerMenuLink').hide();
        //$('#tasksMenuLink').show();
        //$('#studentsMenuLink').show();
        //$('#blogMenuLink').show();
        //$('#logoutMenuLink').show();
    }
}