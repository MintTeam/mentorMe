var app = app || {};

app.taskModel = class TaskModel{
    constructor(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "appdata/"+ this.requester.appKey + '/tasks/';
    }

    getAllTeacherTasks(id){
        var requestUrl = this.serviceUrl + '?query={"_acl.creator":"'+id+'"}';
        return this.requester.get(requestUrl, true);
    };

    postTask(data) {
        var requestUrl = this.serviceUrl;
        return this.requester.post(requestUrl, data, true);
    };

    deleteTask(id){
        var requestUrl = this.serviceUrl + id;
        return this.requester.delete(requestUrl, true);
    };

    getTaskById(id){
        var requestUrl = this.serviceUrl + id;
        return this.requester.get(requestUrl, true);
    };
};