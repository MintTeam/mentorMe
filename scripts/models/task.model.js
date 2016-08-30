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

    getAllStudentTasks(id){
        var requester = this.serviceUrl + '?query={"students._id":"'+id+'"}';
        console.log('model');
        return this.requester.get(requestUrl, true);
    }

    getAllUserTasks(id, type){
        var requestUrl;
        if(type === 'student'){
            requestUrl = this.serviceUrl + '?query={"students._id":"'+id+'"}&resolve_depth=3&sort=deadline';
        }else if(type === 'teacher'){
            requestUrl = this.serviceUrl + '?query={"_acl.creator":"'+id+'"}&resolve=submissions&sort=deadline';
        }
        return this.requester.get(requestUrl, true);
    }

    getTopUserTasks(id, type){
        var requestUrl;
        if(type === 'student'){
            requestUrl = this.serviceUrl + '?query={"students._id":"'+id+'"}&resolve_depth=3&sort=deadline&limit=5';
        }else if(type === 'teacher'){
            requestUrl = this.serviceUrl + '?query={"_acl.creator":"'+id+'"}&resolve=submissions&sort=deadline&limit=5';
        }
        return this.requester.get(requestUrl, true);
    }

    postTask(data) {
        var requestUrl = this.serviceUrl;
        return this.requester.post(requestUrl, data, true);
    };

    editTask(task){
        var requestUrl = this.serviceUrl+ task._id;
        return this.requester.put(requestUrl, task, true);
    }

    deleteTask(id){
        var requestUrl = this.serviceUrl + id;
        return this.requester.delete(requestUrl, true);
    };

    getTaskById(id, isDetailed){
        var requestUrl;
        if(isDetailed){
            requestUrl = this.serviceUrl + id + "/?resolve=students,submissions";
        }else{
            requestUrl = this.serviceUrl + id;
        }
        return this.requester.get(requestUrl, true);
    };

};