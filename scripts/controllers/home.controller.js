var app = app || {};

app.homeController = class HomeController{
    constructor(view){
        this.view = view;
    }

    loadGuestHomePage(menu, wrapper){
        this.view.showGuestHomePage(menu, wrapper);
    }

    loadAbout(menu, wrapper){
        this.view.showAboutPage(menu, wrapper);
    }
};