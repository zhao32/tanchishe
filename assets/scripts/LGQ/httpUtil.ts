var httpUtil = {
    request: function (method, url, data, success, fail, header?: any, responseType?: any) {
        if (header === undefined) header = {};
        if (responseType == undefined) {
            responseType = cc.sys.isNative ? "json" : "";
        }
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        if (data.isNeedToken) {
            // xhr.setRequestHeader('authorization', "Bearer " + cc.sys.localStorage.getItem("UserToken"));
            // xhr.setRequestHeader('UserID', cc.sys.localStorage.getItem("UserID"));
            xhr.setRequestHeader('bausertoken', cc.sys.localStorage.getItem("tcsToken"));


        }
        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        delete data.isNeedToken
        data = JSON.stringify(data)

        for (var Key in header) {
            xhr.setRequestHeader(Key, header[Key]);
        }
        xhr.responseType = responseType;
        xhr.timeout = 15000; // 超时时间，单位是毫秒
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(JSON.stringify(xhr.response));
                    if (success) {
                        success(xhr.response);
                    }
                } else {
                    if (fail) {
                        fail(xhr);
                        fail = null;
                    }
                }
            }
        };
        xhr.onerror = function () {
            console.log("http request onerror");
            fail && fail(xhr);
            fail = null;
        };
        xhr.ontimeout = function (e) {
            console.log("http request timeout");
            fail && fail(xhr);
            fail = null;
        }
        console.log("http request methord:" + method + ",body:" + data);
        xhr.send(data);
    },
    get(url, data, success, fail, header?: any, responseType?: any) {
        console.log(this)
        return httpUtil.request('GET', url, data, success, fail, header, responseType);
    },
    post(url, data, success, fail, header?: any, responseType?: any) {
        console.log(this)
        return httpUtil.request('POST', url, data, success, fail, header, responseType);
    },
    put(url, data, success, fail, header?: any, responseType?: any) {
        console.log(this)
        return httpUtil.request('PUT', url, data, success, fail, header, responseType);
    },
}
export default httpUtil