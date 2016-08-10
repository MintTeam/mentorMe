var app = app || {};

app.router = Sammy(function(){
    let container = '#wrapper',
        requester = new app.requester('kid_Hyv9NDB7', 'f35edbbf6ed74782886520b13c403f2a', 'https://baas.kinvey.com/'),
        homeView = new app.homeView(),
        userView = new app.userView(),
        taskView = new app.taskView(),
        blogView = new app.blogView(),
        teamView = new app.teamView(),
        userModel = new app.userModel(requester),
        taskModel = new app.taskModel(requester),
        blogModel = new app.blogModel(requester),
        teamModel = new app.teamModel(requester),
        homeController = new app.homeController(homeView),
        userController = new app.userController(userView, userModel),
        taskController = new app.taskController(taskView, taskModel),
        blogController = new app.blogController(blogView, blogModel);
        teamController = new app.teamController(teamView, teamModel);

    this.before({except: {path: "#\/(login\/|register\/|about\/)?"}}, function(){
        if(!sessionStorage["sessionId"]){
            this.redirect("#/");
            return false;
        }
    });

    this.get('#/', function(){
        if(!sessionStorage['sessionId']){
            homeController.loadGuestHomePage(container);
        }else{
            userController.loadUserHomePage(container);
        }
    });

    this.get('#/about/', function(){
        homeController.loadAbout(container);
    });

    this.get('#/register/', function(){
        if(!sessionStorage['sessionId']){
            userController.loadRegisterPage(container);
        }else{
            this.redirect('#/');
        }
    });

    this.get('#/login/', function(){
        if(!sessionStorage['sessionId']){
            userController.loadLoginPage(container);
        }else{
            this.redirect('#/');
        }
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
        let def = Q.defer();
        let _this = this;
        userController.getUserType()
            .then(function(type){
                if(type === 'teacher') {
                    def.resolve(taskController.loadAllTeacherTasks(container));
                }else if(type === 'student'){
                    def.resolve(taskController.loadAllStudentTasks(container));
                }
            }, function(){
                def.reject();
            });
        return def.promise;
    });

    this.get("#/new-task/", function(){
        let def = Q.defer();
        let _this = this;
        userController.getUserType()
            .then(function(type){
                if(type === 'teacher') {
                    def.resolve(taskController.loadCreateNewTaskPage(container));
                }else{
                    _this.redirect('#/tasks/');
                }
            }, function(error){
                def.reject(error);
            });
        return def.promise;
    });

    //tasks
    this.bind("load-edit-task-page", function(ev, data){
        "use strict";
        taskController.loadEditTaskHomePage(container, data.id);
    })

    this.get('#/edit-task/', function(e){
        "use strict";
        console.log('eeee: ' + e);
    })


    this.bind('show-task-details', function(ev, data){
        taskController.loadTaskPage(data.id);
    });

    this.bind('create-task', function(ev, data){
        "use strict";
        taskController.createTask(data);
    });

    this.bind('delete-task', function(ev, data){
        "use strict";
        taskController.deleteTaskById(data.id);
    });

    this.get('#/students/', function(){
        "use strict";
        userController.loadAllStudents(container);
    });

    this.bind('add-connection', function(ev, data){
        "use strict";
        userController.addConnection(data.newConnectionId);
    });

    //teams
    this.get('#/teams/', function(){
        "use strict";
        teamController.loadAllTeams(container);
    });

    this.get('#/new-team/', function(){
        "use strict";
        teamController.loadCreateNewTeamPage(container);
    });

    //TODO blog
    this.get('#/blog/', function () {
        blogController.loadAllPosts(container);
    });

    this.get('#/new-post/', function () {
        blogController.loadCreateNewPostPage(container);
    });

    this.bind('create-post', function (ev, data) {
        blogController.createNewPost(data);
    });

    this.bind('show-edit-post-page', function(ev, data){
        "use strict";
        blogController.loadEditPostPage(container, data.id);
    });

    this.bind('edit-post', function (ev, data) {
        blogController.editPost(data._id, {title:data.title, content: data.content, author: data.author});
    });

    this.bind('delete-post', function (ev, data) {
        blogController.deletePost(data.id);
    })

});

app.router.run('#/');
