var app = app || {};

app.teamController = class TeamController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadAllTeams(container){
        var id = sessionStorage['userId'];
        var _this = this;
        return this.model.getAllTeams(id)
            .then(function(data){
                var teams = [];
                data.forEach(function(t){
                    teams.push({
                                name: t.name,
                                studentsCount: t.students.length,
                                tasksCount: t.tasks.length,
                                students: t.students,

                            });
                    });
                    _this.view.showAllTeams(container, teams);
            }).done();
    }

    loadCreateNewTeamPage(container){
        this.view.showCreateNewTeamPage(container);
    }

    createTeam(data){
        var _this = this;
        return this.model.postTeam(data)
            .then(function(success){
                noty({
                	layout: 'topLeft',
                    theme: "bootstrapTheme",
                    type: 'success',
                    text: "Successfully created team!",
                    dismissQueue: true,
                    animation: {
                		open: {height: 'toggle'},
                		close: {height: 'toggle'},
                		easing: 'swing',
                		speed: 500
                    },
                    timeout: 500
                });
                _this.view.clearFormFields();
            });
    }

    deleteTeam(){

    }

    editTeam(){

    }

    addStudentToTeam(id){

    }

    removeStudentFromTeam(id){

    }

    assignTeamTask(){

    }
}