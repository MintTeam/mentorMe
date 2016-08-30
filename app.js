var app = app || {};

app.router = Sammy(function(){
    let container = '#wrapper',
        requester = new app.requester('kid_Hyv9NDB7', 'f35edbbf6ed74782886520b13c403f2a', 'https://baas.kinvey.com/'),
        homeView = new app.homeView(),
        userView = new app.userView(),
        taskView = new app.taskView(),
        blogView = new app.blogView(),
        submissionView = new app.submissionView();
        userModel = new app.userModel(requester),
        taskModel = new app.taskModel(requester),
        blogModel = new app.blogModel(requester),
        submissionModel = new app.submissionModel(requester),
        homeController = new app.homeController(homeView),
        userController = new app.userController(userView, userModel),
        taskController = new app.taskController(taskView, taskModel),
        blogController = new app.blogController(blogView, blogModel),
        submissionController = new app.submissionController(submissionView, submissionModel);

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
            var type;
            userController.getUserType()
                .then(function(t){
                    type = t;
                }).then(function(success){
                taskController.loadTopUserTasks(type)
                    .then(function(tasks){
                        blogController.loadLatestBlogPosts()
                            .then(function(posts){
                                userController.loadUserHomePage(container, tasks, posts);
                            }).done();
                    }).done();
            }).done();
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

    this.bind('user-login', function(ev, data){
        userController.loginUser(data);
    });

    this.bind('register-user', function(ev, data){
        userController.registerUser(data);
    });

    this.bind('redirectUrl', function(ev, data){
        this.redirect(data.url);
    });

    this.bind('show-user-menu', function(ev, data){
        homeController.loadUserMenu();
    });

    this.bind('show-guest-menu', function(ev, data){
        homeController.loadGuestMenu();
    })

    //tasks
    this.get('#/tasks/', function(){
        var type;
        userController.getUserType()
            .then(function(t){
                type = t;
            }).then(function(success){
                taskController.loadAllUserTasks(container, type);
        }).done();
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

    this.bind('load-all-students', function(ev, data){
        userController.loadAllStudents(data.selector);
    })

    this.get("#/edit-task/:id/", function(){
        "use strict";
        var id = this.params['id'];
        taskController.loadEditTaskPage(container, id);
    });

    this.bind('save-changes-to-task', function(ev, data){
        taskController.saveChangesToTask(data);
    });

    //this.bind('add-to-task-collection', function(ev, data){
    //    userController.addTaskToCollection(data.id);
    //})

    this.bind('create-task', function(ev, data){
        "use strict";
        taskController.createTask(data);
    });

    this.bind('delete-task', function(ev, data){
        "use strict";
        taskController.deleteTaskById(data.id);
    });

    this.get('#/assign-task/:id/', function(){
        var taskId = this.params['id'];
        userController.loadAllStudents(container, taskId);
    });

    this.bind("assign-task", function(ev, data){
        taskController.assignTask(data.studentIds, data.taskId);
    });

    this.get('#/check-submissions/:id/', function(){
        var taskId = this.params['id'];
        taskController.checkSubmissions(container, taskId);
    });

    //students
    this.get('#/students/', function(){
        "use strict";
        userController.loadAllStudents(container);
    });

    //connections
    this.bind('add-connection', function(ev, data){
        "use strict";
        userController.addConnection(data.newConnectionId);
    });

    //submissions
    this.get('#/create-submission/:id/', function(){
        var taskId = this.params['id'];
        taskController.loadTaskInfo(taskId)
            .then(function(task){
                var taskInfo = {
                    title: task.title,
                    id: task._id,
                    resources: task.resources,
                    description: task.description
                }
                submissionController.loadCreateNewSubmissionPage(container, taskInfo);
            })
    });

    this.bind('send-submission', function(ev, data){
        submissionController.sendSubmission(data)
            .then(function(success){
                var taskId = success.task._id;
                var submissionId = success._id;
                return taskController.addSubmissionToTask(taskId, submissionId)
            }).done();
    });


    //teams
    //this.get('#/teams/', function(){
    //    "use strict";
    //    teamController.loadAllTeams(container);
    //});
    //
    //this.get('#/new-team/', function(){
    //    "use strict";
    //    teamController.loadCreateNewTeamPage(container);
    //});

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
