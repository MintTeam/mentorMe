var app = app || {};

app.submissionController = class SubmissionController{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }

    loadCreateNewSubmissionPage(container, task){
       this.view.showCreateNewSubmissionPage(container, task);
    }

    sendSubmission(submission){
        var _this = this;
        return this.model.postSubmission(submission);
    }

    loadSubmission(submissionId){
        //TODO
    }

    saveChangesToSubmission(){
        //TODO
    }

    deleteSubmission(){
        //TODO
    }

}