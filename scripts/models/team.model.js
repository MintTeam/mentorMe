var app = app || {};

app.teamModel = class TeamModel{
    constructor(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "appdata/"+ this.requester.appKey + '/teams/';
    }

    getAllTeams(userId){
        var requestUrl = this.serviceUrl + '?query={"_acl.creator":"'+userId+'"}';
        return this.requester.get(requestUrl, true);
    }

    getTeamById(id){
        var requestUrl = this.serviceUrl + id + "/&resolve=students,tasks&retainReferences=talse";
        return this.requester.get(requestUrl, true);
    }

    postTeam(data){
        var requestUrl = this.serviceUrl;
        return this.requester.post(requestUrl, data, true);
    }

}