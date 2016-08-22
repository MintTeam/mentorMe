var app = app || {};

app.userModel = class UserModel{
    constructor(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "user/" + requester.appKey + "/";
    }

    register(data){
        var requestUrl = this.serviceUrl;
        return this.requester.post(requestUrl, data, false);
    };

    login(data){
        var requestUrl = this.serviceUrl + 'login';
        return this.requester.post(requestUrl, data, false);
    };

    logout(){
        var requestUrl = this.serviceUrl + "_logout";
        return this.requester.post(requestUrl, null, true);
    };

    edit(data, id){
        var requestUrl = this.serviceUrl + id;
        return this.requester.put(requestUrl, data, true);
    };

    getUserById(id){
        var requestUrl = this.serviceUrl + id;
        return this.requester.get(requestUrl, true);
    };

    getAllUsers(){
        var requestUrl = this.serviceUrl + "?resolve=type";
        return this.requester.get(requestUrl, true);
    };

    getAllUserConnections(id){
        var requestUrl = this.serviceUrl + id + "/?resolve=connections";
        return this.requester.get(requestUrl, true);
    };
}