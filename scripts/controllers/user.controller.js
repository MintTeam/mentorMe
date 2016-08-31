var app = app || {};

app.userController = class UserController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadUserHomePage(container, urgentTasks, latestPosts, isStudent){
        this.view.showUserHomePage(container, urgentTasks, latestPosts, isStudent);
    };

    loadLoginPage(container){
        this.view.showLoginPage(container);
    };

    loadRegisterPage(container){
        this.view.showRegisterPage(container);
    };

    registerUser(data){
        var userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password,
            type: data.type,
            email: data.email
        };

        return this.model.register(userData)
            .then(function(success){
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;
                sessionStorage['userType'] = success.type;

                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successful registration!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });
                Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/"});
                });

            }, function(error){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'error',
                    text: "Unsuccessful registration! Please try again!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });
            }).done();
    };

    loginUser(data){
        return this.model.login(data)
            .then(function(success){
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;
                sessionStorage['userType'] = success.type;

                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successful login!",
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
                    this.trigger('redirectUrl',{url: "#/"});
                });
            }, function(error){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'error',
                    text: "Unsuccessful login! Please try again!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });
            })
            .done();
    };

    logoutUser(){
        return this.model.logout()
            .then(function(){
                sessionStorage.clear();
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "You logged out successfully!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });

                Sammy(function(){
                    this.trigger('show-guest-menu');
                });

                Sammy(function(){
                    this.trigger('redirectUrl', {url: "#/"})
                });
            }).done();
    };

    loadAllStudents(container, assignees, taskId){
        var _this = this;
        var outputStudents = [];
        var currentUserId = sessionStorage['userId'];
        return this.model.getAllUsers()
            .then(function(users){
                users.forEach(function(user){
                    if(user.type === 'student' && currentUserId != user._id){
                        if(assignees){
                            if(!assignees.some(function(student){
                                return student._id === user._id;
                            })){
                                outputStudents.push(user);
                            }
                        }else{
                            outputStudents.push(user);
                        }
                    }
                });
                _this.view.showAllStudents(container, outputStudents, taskId);
            }).done();
    };

    loadUserInfo(id) {
        return this.getUserById(id)
            .then(function(user){
                return user;
            })
    }
}