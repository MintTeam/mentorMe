var app = app || {};

app.homeView = class HomeView{
    constructor(templates){
        this.templates = templates;
    }

    showGuestHomePage(menu, container){
        $.get("templates/menus/menu-guest.html", function(template){
            $(menu).html(template);
        });
        $.get("templates/home/welcome-guest.html", function(template){
            $(container).html(template);
        });
    }

    showAboutPage(menu, container){
        if(!sessionStorage['sessionId']){
            $.get("templates/menus/menu-guest.html", function(template){
                $(menu).html(template);
            });
        }
        $.get("templates/about/about.html", function(template){
            $(container).html(template);
        })
    }
}