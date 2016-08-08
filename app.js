var app = app || {};

app.router = Sammy(function(){

    let menu = '#menu',
        container = '#wrapper',
        requester = new app.requester('kid_Hyv9NDB7', 'f35edbbf6ed74782886520b13c403f2a', 'https://baas.kinvey.com/'),
        homeView = new app.homeView(),
        userView = new app.userView(),
        taskView = new app.taskView(),
        userModel = new app.userModel(requester),
        taskModel = new app.taskModel(requester),
        homeController = new app.homeController(homeView),
        userController = new app.userController(userView, userModel),
        taskController = new app.taskController(taskView, taskModel);

    this.before({except: {path: "#\/(login\/|register\/|about\/)?"}}, function(){
        if(!sessionStorage["sessionId"]){
            this.redirect("#/");
            return false;
        }
    });

    this.get('#/', function(){
        if(!sessionStorage['sessionId']){
            homeController.loadGuestHomePage(menu, container);
        }else{
            userController.loadUserHomePage(menu, container);
        }
    });

    this.get('#/about/', function(){
        homeController.loadAbout(menu, container);
    });

    this.get('#/register/', function(){
        userController.loadRegisterPage(menu, container);
    });

    this.get('#/login/', function(){
        userController.loadLoginPage(menu, container);
    });

    this.get('#/logout/', function(){
        userController.logoutUser();
    });

    //user binds
    this.bind('user-login', function(ev, data){
        userController.loginUser(data);
    });

    this.bind('register-user', function(ev, data){
        userController.registerUser(data);
    });

    this.bind('redirectUrl', function(ev, data){
        this.redirect(data.url);
    });

    //tasks
    this.get('#/tasks/', function(){
        var def = Q.defer();
        var _this = this;
        userController.getUserType()
            .then(function(type){
                if(type === 'teacher') {
                    def.resolve(taskController.loadAllTeacherTasks(menu, container));
                }else if(type === 'student'){
                    def.resolve(taskController.loadAllStudentTasks(menu, container));
                }
            }, function(){
                def.reject();
            });
        return def.promise;
    });

    this.get("#/new-task/", function(){
        var def = Q.defer();
        var _this = this;
        userController.getUserType()
            .then(function(type){
                if(type === 'teacher') {
                    def.resolve(taskController.loadCreateNewTaskPage(menu, container));
                }else{
                    _this.redirect('#/');
                }
            }, function(error){
                def.reject(error);
            });
        return def.promise;
    });

    //task event binds

    this.bind('show-task-details', function(ev, data){
        taskController.loadTaskPage(data.id);
    });

    this.bind('create-task', function(ev, data){
        taskController.createTask(data);
    });

    this.bind('delete-task', function(ev, data){
        taskController.deleteTaskById(data.id);
    });

    this.get('#/students/', function(){
        "use strict";
        userController.loadAllStudents(menu, container);
    });

    //this.bind('refresh-students-page', function(ev, data){
    //    "use strict";
    //    userController.loadAllStudents(menu, container);
    //});

    this.bind('add-connection', function(ev, data){
        "use strict";
        userController.addConnection(data.newConnectionId);
    })
});

app.router.run('#/');
