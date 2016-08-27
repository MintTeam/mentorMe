var app = app || {};

app.blogController = class BlogController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    loadAllPosts(container) {
        var _this = this;

        this.model.getAllPosts()
            .then(function (data) {
                var posts = [];
                var collection = Array.prototype.slice.call(data, 0);
                for(var i = 0; i < collection.length; i++){
                    var post = collection[i];
                    var isAuthor = false;
                    if(sessionStorage['username'] === post.author._obj.username){
                        isAuthor=true;
                    }

                     posts.push({
                         _id: post._id,
                         author: post.author._obj.username,
                         title: post.title,
                         content: post.content,
                         date: post._kmd.ect,
                         isAuthor: isAuthor
                     });

                }
                posts = posts.sort(function(a,b){
                     return a.date < b.date;
                 });

                for (var i = 0; i < posts.length; i++) {
                    posts[i].date = moment(post._kmd.ect).format("LL")
                }

                _this.view.showAllPosts(container, posts);
            }).done();
    }

    loadCreateNewPostPage(container) {
        this.view.showCreateNewPostPage(container);
    }

    loadEditPostPage(container,id){
        var _this = this;
        return this.model.getPostById(id)
            .then(function(post){
                _this.view.showEditPostPage(container, post);
            })
    }

    createNewPost(data) {
        var _this = this;
        return this.model.sendPost(data)
            .then(function (success) {
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successfully created new post!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });
                _this.view.clearFormFields();
                Sammy(function () {
                    this.trigger('redirectUrl', {url: "#/blog/"});
                })
            }, function(error){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'error',
                    text: "Couldn't create the post!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });
            }).done();
        
    }

    editPost (id, data) {
        var _this = this;
        this.model.sendChangesToPost(id, data)
            .then(function(success){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successfully edited new post!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });
                _this.view.clearFormFields();
                Sammy(function () {
                    this.trigger('redirectUrl', {url: "#/blog/"});
                })
            }, function(error){
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'error',
                    text: "Couldn't edit the post!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });
            }).done()
    }
    
    deletePost (id) {
        var _this = this;
        this.model.deleteUserPost(id)
            .then(function (success) {
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successfully deleted this post!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 200
                });
                _this.view.clearFormFields();
                Sammy(function () {
                    this.trigger('redirectUrl', {url: "#/blog/"});
                })
            }, function (error) {
                noty({
                    layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'error',
                    text: "Couldn't delete the post!",
                    dismissQueue: true,
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    timeout: 500
                });

            }).done()
    }
    
};