var app = app || {};

app.blogView = class BlogView {
    constructor(){
    }
    
    showAllPosts(container, posts) {
        this.showUserMenu();
        $.get('templates/blog/posts.html', function (templ) {
            var rendered = Mustache.render(templ, {posts: posts});
            $(container).html(rendered);

            $('#editButton').on('click', function(e){
                var id = $(e.target).parent().attr('id');
                Sammy(function () {
                    this.trigger('show-edit-post-page', {id:id});
                })
            });
            
            $('#deleteButton').on('click', function (e) {
                var id = $(e.target).parent().attr('id');
                console.log(id);
                var title = $("#title").html();

                noty({
                    layout: 'topLeft',
                    type: 'confirm',
                    text: "Are you sure you want to delete post with Title: <strong>"
                    + title + "?",
                    animation: {
                        open: {height: 'toggle'},
                        close: {height: 'toggle'},
                        easing: 'swing',
                        speed: 500
                    },
                    buttons: [
                        {
                            addClass: 'btn btn-primary', text: 'Yes', onClick: function($noty) {
                            Sammy(function(){
                                this.trigger('delete-post', {id: id});
                            });

                            $noty.close();
                        }
                        },
                        {
                            addClass: 'btn btn-danger', text: 'No', onClick: function($noty) {
                            $noty.close();
                        }
                        }
                    ]
                });
            });

        });
    }

    showEditPostPage(container, post){
        this.showUserMenu();
        $.get('templates/blog/edit-post.html', function (templ) {
            var rendered = Mustache.render(templ, {title: post.title, content: post.content, _id:post._id});
            $(container).html(rendered);

            $("#savePostChanges").on('click', function (e){
                var id = $(e.target).parent().attr('id');
                var title = $('#title').val();
                var content = $('#content').val();
                var userId = sessionStorage['userId'];
                var author = {
                    "_type": "KinveyRef",
                    "_id": userId,
                    "_collection": "user"
                };
                
                if (title !== post.title || content !== post.content) {
                    Sammy(function () {
                        this.trigger("edit-post", {_id: id, title: title, content: content, author: author});
                    })
                }
            })
        })
    }

    showCreateNewPostPage(container) {
        this.showUserMenu();
        $.get('templates/blog/create-post.html', function (templ) {
            $(container).html(templ);

            $('#sendPost').on('click', function(){
                var title = $('#postTitle').val();
                var content = $('#postContent').val();
                var id = sessionStorage['userId'];
                var author = {
                    "_type": "KinveyRef",
                    "_id": id,
                    "_collection": "user"
                };
                if(title && content) {
                    Sammy(function () {
                        this.trigger('create-post', {title: title, content: content, author: author});
                    })
                }
                
            })
        });
    }

    showUserMenu(){
        $('#loginMenuLink').hide();
        $('#registerMenuLink').hide();
        $('#tasksMenuLink').show();
        $('#studentsMenuLink').show();
        $('#teamsMenuLink').show();
        $('#blogMenuLink').show();
        $('#logoutMenuLink').show();
    }

    clearFormFields(){
        $('input').val('');
        $('textarea').val('');
        $('select').val('default');
    }
};

