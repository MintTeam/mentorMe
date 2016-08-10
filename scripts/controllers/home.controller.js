var app = app || {};

app.homeController = class HomeController{
    constructor(view){
        this.view = view;
    }

    loadGuestHomePage(wrapper){
        this.view.showGuestHomePage(wrapper);
    }

    loadAbout(menu, wrapper){
        this.view.showAboutPage(menu, wrapper);
    }
};