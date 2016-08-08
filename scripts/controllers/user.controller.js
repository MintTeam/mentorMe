var app = app || {};

app.userController = class UserController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadGuestHomePage(menu, container){
        this.view.showLoginPage(menu, container);
    };

    loadUserHomePage(menu, container){
        var type;
        var _this = this;
        var id = sessionStorage.userId;
        return this.model.getUserById(id)
            .then(function(data){
                type = data.type._obj.name;
                _this.view.showUserHomePage(menu, container, type);
            }, function(error){
                console.error(error);
            }).done();
    };

    loadLoginPage(menu, container){
        this.view.showLoginPage(menu, container);
    };

    loadRegisterPage(menu, container){
        this.view.showRegisterPage(menu, container);
    };

    registerUser(data){
        //var _this = this;
        var userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password,
            type: {
                "_type" : "KinveyRef",
                "_id": data.typeId,
                "_collection": "user-types"
            },
            email: data.email,
            connections: [],
            teams: [],
            tasks: [],
            posts: [],
            comments: [],
        };

        return this.model.register(userData)
            .then(function(success){
                sessionStorage['sessionId'] = success._kmd.authtoken;
                sessionStorage['username'] = success.username;
                sessionStorage['userId'] = success._id;
                sessionStorage['userType'] = success.type._id;

                noty({
                    layout: 'topLeft',
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
                sessionStorage['userType'] = success.type._id;

                noty({
                    layout: 'topLeft',
                    type: 'success',
                    text: "Successful login!",
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
                    this.trigger('redirectUrl',{url: "#/"});
                });

            }, function(error){
                noty({
                    layout: 'topLeft',
                    type: 'error',
                    text: "Unsuccessful login! Please try again!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
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
                    this.trigger('redirectUrl', {url: "#/"})
                });
            }).done();
    };

    getUserType(){
        var type;
        var id = sessionStorage.userId;
        return this.model.getUserById(id)
            .then(function(data){
                type = data.type._obj.name;
                return type;
            });
    };

    loadAllStudents(menu, container){
        var students = [];
        var _this = this;
        var allUsers = [];
        var currentUserType = this.getUserType();
        var currentConnections = [];
        var currentUserId = sessionStorage['userId'];
        return this.model.getAllUsers()
            .then(function(users){
                allUsers = users;
            }).then(function(success){
                return _this.model.getAllUserConnections(currentUserId)
                    .then(function(data){
                        currentConnections = data.connections;
                        for(var user in allUsers){
                            if(allUsers[user].type._obj.name === 'student'){
                                var student = allUsers[user];
                                if(_.findWhere(currentConnections, {_id: student._id})){
                                    student['connected'] = true;
                                }else{
                                    student['connected'] = false;
                                }
                                students.push(student);
                            }
                        }
                        _this.view.showAllStudents(menu, container, students, currentUserType);
                    });

            }).done();
    };

    addConnection(newConnectionId){
        var _this = this;
        var userId = sessionStorage['userId'];
        var currentUser = {};
        return this.model.getUserById(userId)
            .then(function(user){
                if(!(_.findWhere(user.connections, {_id: newConnectionId}))){
                    user.connections.push({
                        "_type":"KinveyRef",
                        "_id":newConnectionId,
                        "_collection":"user"
                    });
                }
                currentUser = user;
            }).then(function() {
                return _this.model.edit(currentUser)
                    .then(function(success){
                        //update ui
                        _this.view.updateConnectionDataUI(newConnectionId);
                    });
            }).done();
    };

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
    //            //this.view.showAllConnections(menu, container, connections);
    //        }, function(error){
    //            console.error(error);
    //        });
    //};
}