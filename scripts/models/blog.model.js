var app = app || {};

app.blogModel = class BlogModel {
    constructor(requester){
        this.requester = requester;
        this.serviceUrl = requester.baseUrl + "appdata/"+ this.requester.appKey + '/posts/';
    }

    getAllPosts() {
        var requestUrl = this.serviceUrl + "?resolve=author";
        return this.requester.get(requestUrl, true);
    }

    getLatestPosts(){
        var requestUrl = this.serviceUrl + "?resolve=author&sort=_kmd.ect&limit=5";
        return this.requester.get(requestUrl, true);
    }

    sendPost(data){
        var requestUrl = this.serviceUrl;
        return this.requester.post(requestUrl, data, true);
    }

    getPostById(id) {
        var requestUrl = this.serviceUrl + id + "/?resolve=author";
        return this.requester.get(requestUrl, true);
    }

    sendChangesToPost(id, data){
        var requestUrl = this.serviceUrl + id;
        return this.requester.put(requestUrl, {title: data.title, content: data.content, author: data.author}, true);
    }

    deleteUserPost(id){
        var requestUrl = this.serviceUrl + id;
        return this.requester.delete(requestUrl, true);
    }
};