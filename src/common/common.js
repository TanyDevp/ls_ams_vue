exports.install = (Vue, options) => {
    const BASE_URL = 'http://192.168.3.98:9001/';
    const key = 'NohM2pSelE=D88B4C47@MTUyNDAzMTc1MC44NTU5OA==';

    Vue.prototype.$windowHeight = window.screen.availHeight;

    Vue.prototype.$getServerData = (funcName, params, func) => {
        let _this = Vue.prototype;
        _this.$Message.config({
            top: 60,
            duration: 3,
        });
        _this.$Loading.config({
            color: '#00af8d',
            failedColor: '#f0ad4e',
            height: 4
        });
        _this.$Loading.start();
        // var searchParams;
        // // debugger;
        // try {
        //     searchParams = new URLSearchParams()
        //     searchParams.set('SessionKey', key);
        //     for (let parm in params) {
        //         searchParams.set(parm, params[parm]);
        //     }
        // }
        // catch (e) {
        //     searchParams = 'SessionKey=' + key;
        //     for (let parm in params) {
        //         searchParams += '&' + parm + '=' + params[parm]
        //     }
        // }
        //   return _this.axios.post(BASE_URL + funcName, params).then(response => {
        //     _this.$Spin.hide();
        //     return response.json()
        // })
        params.SessionKey = key;
        return _this.axios({
            method: "POST",
            url: BASE_URL + funcName,
            data: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    if (data[it] instanceof Array) {
                        data[it].map((x, i) => {
                            ret += encodeURIComponent(it) + '[' + i + ']=' + encodeURIComponent(x) + '&'
                        })
                    }
                    else {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                }
                return ret
            }],
        }).then(response => {
            _this.$Loading.finish();
            return response.data;
        })
            .then(responseJson => {
                if (responseJson.ErrDesc == '请登入') {
                    _this.$Message.warning('登录身份过期，请重新登录。');
                    return responseJson
                }
                else if (responseJson.IsErr) {
                    _this.$Message.warning('返回数据过程中出错。');
                    return responseJson
                }
                func(responseJson);
                return responseJson;
            }).catch(err => {
                _this.$Loading.error();
                _this.$Message.error('服务器异常。');
                console.error(err);
                return err;
            });
    };
}; 