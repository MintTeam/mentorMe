var app = app || {};

app.userView = class UserView{
    constructor(){
    }

    showUserHomePage(container, type){
        this.showUserMenu();
        switch(type){
            case 'student':
                $.get('templates/home/home-student.html', function(template){
                    var username = sessionStorage['username'];
                    var rendered = Mustache.render(template, {username: username});
                    $(container).html(rendered);
                });
                break;
            case 'teacher':
                $.get('templates/home/home-teacher.html', function(template){
                    var username = sessionStorage['username'];
                    var rendered = Mustache.render(template, {username: username});
                    $(container).html(rendered);
                });
                break;
        }
    }

    showLoginPage(container){
        $.get("templates/login/login.html", function(template){
            $(container).html(template);
            $('#loginBtn').on("click", function(){
                var username= $('#username').val();
                var password = $('#password').val();

                Sammy(function(){
                    this.trigger('user-login', {username: username, password: password});
                });
            });
        });
    }

    showRegisterPage(container) {
        $.get('templates/register/register.html', function(template){
            $(container).html(template);

            $('#registerBtn').click(function(){
                var type = $("input[type='radio'][name='role']:checked").val();
                var firstName = $('#firstName').val();
                var lastName = $('#lastName').val();
                var username = $('#username').val();
                var email = $('#email').val();
                var password = $('#password').val();
                var confirmPassword = $('#confirm-password').val();

                if(password !== confirmPassword){
                    $('#confirm-password').parent().addClass('has-error');
                }else{
                    if((type === 'student' || type === 'teacher') && (firstName && lastName && username && email && password)){
                        Sammy(function(){
                            this.trigger('register-user',
                                {
                                    firstName: firstName,
                                    lastName: lastName,
                                    username: username,
                                    password: password,
                                    email: email,
                                    type: type
                                });
                        });
                    }else{
                        noty({
                            layout: 'topLeft',
                            theme: "bootstrapTheme",
                            type: 'error',
                            text: "One or more required fields are empty. Please, complete your registration.",
                            dismissQueue: true,
                            animation: {
                                open: {height: 'toggle'},
                                close: {height: 'toggle'},
                                easing: 'swing',
                                speed: 500
                            },
                            timeout: 800
                        });
                    }
                }
            });
        });
    }

    showAllStudents(container, students, taskId){
        this.showUserMenu();
        $.get('templates/common/students.html', function(template){
            var rendered = Mustache.render(template, {students: students, taskId:taskId});
            $(container).html(rendered);

            $(".connectBtn").click(function(e){
                var newConnectionId = $(e.target).parent().attr('id');
                Sammy(function(){
                    this.trigger('add-connection', {newConnectionId: newConnectionId});
                });
            });

            $('#addSelectedStudents').click(function(e){
                var studentIds = $('input:checked')
                    .map(function(){
                        return $(this).val();
                    });

                Sammy(function(){
                    this.trigger('assign-task', {taskId:taskId, studentIds: studentIds});
                })
            })
        });
    }


    updateConnectionDataUI(id){
        var studentElement = "#" + id;
        $(studentElement).find('button').addClass('animated fadeOut');
        $(studentElement).find('button').remove();
        $(studentElement).append('<div class="btn btn-sm btn-default animated fadeIn"><span class="glyphicon glyphicon-ok"></span>Added</div>');
    }

    showUserMenu(){
        Sammy(function(){
            this.trigger('show-user-menu');
        });
    }
}
