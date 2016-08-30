var app = app || {};

app.userController = class UserController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadUserHomePage(container, urgentTasks, latestPosts){
        var type;
        var _this = this;
        var id = sessionStorage.userId;
        return this.model.getUserById(id)
            .then(function(data){
                type = data.type;
                _this.view.showUserHomePage(container, type, urgentTasks, latestPosts);
            }, function(error){
                console.error(error);
            }).done();
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

    getUserType(){
        var type;
        var id = sessionStorage['userId'];
        return this.model.getUserById(id)
            .then(function(data){
                type = data.type;
                return type;
            });
    };

    loadAllStudents(container, taskId){
        var _this = this;
        var students = [];
        var currentUserId = sessionStorage['userId'];
        return this.model.getAllUsers()
            .then(function(users){
                users.forEach(function(user){
                    if(user.type === 'student' && currentUserId != user._id){
                        students.push(user);
                    }
                });
                _this.view.showAllStudents(container, students, taskId);
            }).done();
    };

    //addTaskToCollection(taskId){
    //    var _this = this;
    //    var userId = sessionStorage['userId'];
    //    return this.model.getUserById(userId)
    //        .then(function(user){
    //            user.tasks.push(	{
    //                "_type":"KinveyRef",
    //                "_id":taskId,
    //                "_collection":"tasks"
    //            });
    //            return _this.model.edit(user, userId)
    //                .then(function(success){
    //                }, function(error){
    //                    console.error(error);
    //                });
    //        }).done();
    //}

    //addConnection(newConnectionId){
    //    var _this = this;
    //    var userId = sessionStorage['userId'];
    //    var currentUser = {};
    //    return this.model.getUserById(userId)
    //        .then(function(user){
    //            if(!(_.findWhere(user.connections, {_id: newConnectionId}))){
    //                user.connections.push({
    //                    "_type":"KinveyRef",
    //                    "_id":newConnectionId,
    //                    "_collection":"user"
    //                });
    //            }
    //            currentUser = user;
    //        }).then(function() {
    //            return _this.model.edit(currentUser, userId)
    //                .then(function(success){
    //                    //update ui
    //                    _this.view.updateConnectionDataUI(newConnectionId);
    //                });
    //        }).done();
    //};

    loadUserInfo(id) {
        return this.getUserById(id)
            .then(function(user){
                return user;
            })
    }



    //loadAllUserConnections(){
    //    //var _this = this;
    //    var connections = [];
    //    var currentUserId = sessionStorage['userId'];
    //    return this.model.getAllUserConnections(currentUserId)
    //        .then(function (data){
    //            data = data.connections;
    //            console.log(data);
    //            for(var index in data){
    //                connections.push({
    //                    _id: data[index]._obj._id,
    //                    username: data[index]._obj.username,
    //                    firstName: data[index]._obj.firstName,
    //                    lastName: data[index]._obj.lastName
    //                });
    //            }
    //            //this.view.showAllConnections(container, connections);
    //        }, function(error){
    //            console.error(error);
    //        });
    //};
}