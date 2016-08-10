var app = app || {};

app.teamView = class TeamView{
    constructor(){
    }

    showAllTeams(container, teams){
        this.showUserMenu();
        $.get('templates/teams/teams.html', function(template){
            var rendered = Mustache.render(template, {teams: teams});
            $(container).html(rendered);
        });
    }

    showCreateNewTeamPage(container, students){
        this.showUserMenu();
        $.get('templates/teams/create-team.html', function(template){
            $(container).html(template);
        })

        $("#addTeam").on('click', function(){
            var name = $('#teamName').val();
            //TODO solve how to get all connected students and pop up with a checkboxes
            // var students
            var tasks = [];
        })
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

}
