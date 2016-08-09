var app = app || {};

app.htmlLoader = class HtmlLoader{
    constructor() {
        this.resources = {
            'about': 'templates/about/about.html',
            'menuGuest':'templates/menus/menu-guest.html',
            'welcomeGuest':'templates/home/welcome-guest.html'
        }
    }

    getTemplates(){
        var def = Q.defer();
        let templates = {};
        for(var key in this.resources){
            var url = this.resources[key];
            $.get(url, function(template){
                def.resolve(templates[key] = template);
            });
        }
        return def.promise;
    }

    load(){
        return this.getTemplates();
    }
}