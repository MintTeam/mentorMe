var app = app || {};

app.homeView = class HomeView{
    constructor(){
    }

    showGuestHomePage(container){
        this.showGuestMenu();
        $.get("templates/home/welcome-guest.html", function(template){
            $(container).html(template);
        });
    }

    showAboutPage(container){
        if(!sessionStorage['sessionId']){
            this.showGuestMenu();
        }else{
            this.showUserMenu();
        }
        var userId = sessionStorage['userId'];
        $.get("templates/about/about.html", function(template){
            var rendered = Mustache.render(template, {userId: userId})
            $(container).html(rendered);
        });
    }

    showGuestMenu(){
        $('#loggedUserInfo a').html("");
        $('#loginMenuLink').show();
        $('#registerMenuLink').show();
        $('#tasksMenuLink').hide();
        $('#studentsMenuLink').hide();
        $('#blogMenuLink').hide();
        $('#logoutMenuLink').hide();
    }

    showUserMenu(){
        var username = sessionStorage['username'];
        var usertype = sessionStorage['userType'];
        $('#loggedUserInfo a').html("<strong>"+username+"</strong>" + "&nbsp;<span class='label label-info'>"+ usertype + "</span>");
        $('#loginMenuLink').hide();
        $('#registerMenuLink').hide();
        $('#tasksMenuLink').show();
        $('#studentsMenuLink').show();
        $('#blogMenuLink').show();
        $('#logoutMenuLink').show();
    }
}