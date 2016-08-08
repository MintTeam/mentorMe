var app = app || {};

app.userView = class UserView{
    constructor(){
    }

    showUserHomePage(menu, container, userTypeName){
        this.loadUserMenu(menu, userTypeName);
        switch(userTypeName){
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

    loadUserMenu(menu, userType) {
        if(userType === 'student'){
            $.get('templates/menus/menu-student.html', function(template){
                $(menu).html(template);
            });
        }else{
            $.get('templates/menus/menu-teacher.html', function(template){
                $(menu).html(template);
            });
        }
    }

    showLoginPage(menu, container){
        $.get("templates/menus/menu-guest.html", function(template){
            $(menu).html(template);
        });
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

    showRegisterPage(menu, container) {
        $.get('templates/menus/menu-guest.html', function(template){
            $(menu).html(template);
        });
        $.get('templates/register/register.html', function(template){
            $(container).html(template);

            var pictureSize, file;

            $("#uploadBtn").on('change', function () {
                var fileContent = readURL(this);
                pictureSize = this.files[0].size;
                file = this.files[0];
                console.log(file);
                var filename = $('#uploadBtn').val();
                $('#uploadFile').val(filename);
            });

            $('#registerBtn').on('click', function(){
                var typeId = $("input[type='radio'][name='role']:checked").val();
                var firstName = $('#firstName').val();
                var lastName = $('#lastName').val();
                var username = $('#username').val();
                var email = $('#email').val();
                var password = $('#password').val();
                var confirmPassword = $('#confirm-password').val();

                if(password !== confirmPassword){
                    $('#confirm-password').parent().addClass('has-error');
                }else{
                    if(typeId && firstName && lastName && username && email && password){
                        Sammy(function(){
                            this.trigger('register-user',
                                {
                                    firstName: firstName,
                                    lastName: lastName,
                                    username: username,
                                    password: password,
                                    email: email,
                                    typeId: typeId,
                                    //file: file
                                });
                        });
                    }else{
                        noty({
                            layout: 'topLeft',
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

    showAllStudents(menu, container, students, type){
        this.loadUserMenu(menu, type);
        $.get('templates/teacher-views/students.html', function(template){
            var rendered = Mustache.render(template, {students: students});
            $(container).html(rendered);

            $(function () {
                $('.example-popover').popover({
                    container: 'body'
                })
            })

            $(".connectBtn").click(function(e){
                var newConnectionId = $(e.target).parent().attr('id');
                Sammy(function(){
                    this.trigger('add-connection', {newConnectionId: newConnectionId});
                });
            })
        });
    }

    updateConnectionDataUI(id){
        var studentElement = "#" + id;
        $(studentElement).find('button').addClass('animated fadeOut')
        $(studentElement).find('button').remove();
        $(studentElement).append('<div class="btn btn-sm btn-default animated fadeIn"><span class="glyphicon glyphicon-ok"></span>Added</div>');
    }

    //showAllConnections(menu, container, data){
    //    $.get('templates/menus/menu-teacher.html', function(template){
    //        $(menu).html(template);
    //    });
    //    $.get('templates/teacher-views/students.html', function(template){
    //        var rendered = Mustache.render(template, {connections: data});
    //        $(container).html(rendered);
    //    });
    //}
}