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
        $.get("templates/about/about.html", function(template){
            $(container).html(template);
        });
    }

    showGuestMenu(){
        $('#loggedUserInfo a').html();
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
        $('#loggedUserInfo a').html('<img src="img/vc-logo.png">'+username + ", " + usertype);
        $('#loginMenuLink').hide();
        $('#registerMenuLink').hide();
        $('#tasksMenuLink').show();
        $('#studentsMenuLink').show();
        $('#blogMenuLink').show();
        $('#logoutMenuLink').show();
    }
}