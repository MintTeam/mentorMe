var app = app || {};

app.requester = class Requester{
    constructor(appKey, appSecret, baseUrl){
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.baseUrl = baseUrl;
    };

    getHeaders(isJSON, useSession){
        var headers = {},
            token;

        if(isJSON){
            headers["Content-Type"] = 'application/json';
        }

        if(useSession){
            token =  sessionStorage['sessionId'];
            headers['Authorization'] = 'Kinvey '+ token;
        }else{
            token = this.appKey+':'+this.appSecret;
            headers['Authorization'] = 'Basic ' + btoa(token);
        }
        return headers;
    }

    makeRequest(method, url, headers, data){
        var defer = Q.defer();
        $.ajax({
            method: method,
            url: url,
            headers : headers,
            data: JSON.stringify(data)||null,
            success: function(data){
                defer.resolve(data);
            },
            error: function(error){
                defer.reject(error);
            }
        });

        return defer.promise;
    }

    get(url, useSession){
        let headers = this.getHeaders(false, useSession);
        return this.makeRequest('GET', url, headers, null);
    };

    post(url, data, useSession){
        let headers = this.getHeaders(data, useSession);
        return this.makeRequest("POST", url, headers, data);
    };

    put(url, data, useSession){
        let headers = this.getHeaders(true, useSession);
        return this.makeRequest('PUT', url, headers, data);
    };

    delete(url, useSession){
        let headers = this.getHeaders(false, useSession);
        return this.makeRequest('DELETE', url, headers, null);
    }


}

