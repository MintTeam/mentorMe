var app = app || {};

app.submissionModel = class SubmissionModel{
    constructor(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "appdata/"+ this.requester.appKey + '/submissions/';
    }

    postSubmission(submission){
        var requestUrl = this.serviceUrl;
        return this.requester.post(requestUrl, submission, true);
    }

    getSubmissionById(){
        //TODO
    }

    editSubmission(){
        //TODO
    }

    deleteSubmission(){
        //TODO
    }
}