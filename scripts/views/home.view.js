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
        $('#loginMenuLink').show();
        $('#registerMenuLink').show();
        $('#tasksMenuLink').hide();
        $('#studentsMenuLink').hide();
        //$('#teamsMenuLink').hide();
        $('#blogMenuLink').hide();
        $('#logoutMenuLink').hide();
    }

    showUserMenu(){
        $('#loginMenuLink').hide();
        $('#registerMenuLink').hide();
        $('#tasksMenuLink').show();
        $('#studentsMenuLink').show();
        //$('#teamsMenuLink').show();
        $('#blogMenuLink').show();
        $('#logoutMenuLink').show();
    }
}