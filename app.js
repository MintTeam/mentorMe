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
            var type = sessionStorage['userType'];
            taskController.loadTopUserTasks(type)
                .then(function(tasks){
                    blogController.loadLatestBlogPosts()
                        .then(function(posts){
                            var isStudent = false;
                            if(type === 'student'){
                                isStudent = true;
                            }
                            userController.loadUserHomePage(container, tasks, posts, isStudent);
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
    });

    //tasks
    this.get('#/tasks/', function(){
        var type = sessionStorage['userType'];
        taskController.loadAllUserTasks(container, type)
    });

    this.get("#/new-task/", function(){
        let type = sessionStorage['userType'];
        if(type === 'teacher') {
            taskController.loadCreateNewTaskPage(container);
        }else{
            this.redirect('#/tasks/');
        }
    });

    this.bind('load-all-students', function(ev, data){
        userController.loadAllStudents(data.selector);
    });

    this.get("#/edit-task/:id/", function(){
        "use strict";
        var id = this.params['id'];
        taskController.loadEditTaskPage(container, id);
    });

    this.bind('save-changes-to-task', function(ev, data){
        taskController.saveChangesToTask(data);
    });

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
        var assignees;
        taskController.loadTaskInfo(taskId, true)
            .then(function(task){
                assignees = task.students;
                var taskInfo = {_id : task._id, title: task.title}
                userController.loadAllStudents(container, assignees, taskInfo);
            })
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

    //blog
    this.get('#/blog/', function () {
        blogController.loadAllPosts(container);
    });

    this.get('#/new-post/', function () {
        blogController.loadCreateNewPostPage(container);
    });

    this.bind('create-post', function (ev, data) {
        blogController.createNewPost(data);
    });

    this.get('#/edit-post/:id/', function(){
        var id = this.params['id'];
        blogController.loadEditPostPage(container, id);
    });

    this.bind('edit-post', function (ev, data) {
        blogController.editPost(data._id, {title:data.title, content: data.content, author: data.author});
    });

    this.bind('delete-post', function (ev, data) {
        blogController.deletePost(data.id);
    });

});

app.router.run('#/');
