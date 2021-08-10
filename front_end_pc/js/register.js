const vm = new Vue({
    el: '#app',
    data: {
        host: 'http://127.0.0.1:8000',
        host1: 'http://127.0.0.1:8080',
        error_name: false,
        error_password: false,
        error_phone: false,
        username: '',
        password: '',
        mobile: '',
        error_name_message: '',
        error_phone_message: '',
        error_password_message: ''
    },
    methods: {
        // 检查用户名
        check_username: function () {
            var len = this.username.length;
            if (len < 5 || len > 20) {
                this.error_name_message = '请输入5-20个字符的用户名';
                this.error_name = true;
            } else {
                this.error_name = false;
            }
            // 检查重名
            if (this.error_name === false) {
                axios.get(this.host + '/users/usernames/' + this.username + '/count/', {
                    responseType: 'json'
                })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_name_message = '用户名已存在';
                            this.error_name = true;
                        } else {
                            this.error_name = false;
                        }
                    })
                    .catch(error => {
                        alert(error.response.data)
                        console.log(error.response.data);
                    })
            }
        },
        check_pwd: function () {
            const len = this.password.length;
            if (len < 8 || len > 20) {
                this.error_password = true;
                this.error_password_message = '您的密码长度小于8或者大于20'
            } else {
                this.error_password = false;
            }
        },

        // 检查手机号
        check_phone: function () {
            const re = /^1[3-9]\d{9}$/;
            if (re.test(this.mobile)) {
                this.error_phone = false;
            } else {
                this.error_phone_message = '您输入的手机号格式不正确';
                this.error_phone = true;
            }
            if (this.error_phone == false) {
                axios.get(this.host + 'users/mobiles/' + this.mobile + '/count/', {
                    responseType: 'json'
                })
                    .then(response => {
                        if (response.data.count > 0) {
                            this.error_phone_message = '手机号已存在';
                            this.error_phone = true;
                        } else {
                            this.error_phone = false;
                        }
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    })
            }
        },
        // 注册
        on_submit: function () {
            this.check_username();
            this.check_pwd();
            this.check_phone();
            if (this.error_name == false && this.error_password == false && this.error_phone == false) {
                axios.post(this.host + '/users/register/', {
                        username: this.username,
                        password: this.password,
                        mobile: this.mobile,
                    },
                    {
                        responseType: 'json',
                    })
                    .then(response => {
                        // 记录用户的登录状态
                        sessionStorage.clear();
                        localStorage.clear();
                        localStorage.username = response.data.username;
                        this.username = response.data.username;
                        // localStorage.user_id = response.data.id;
                        location.href = '/index.html';
                    })
                    .catch(error => {
                        if (error.response.status == 400) {
                            if ('non_field_errors' in error.response.data) {
                                this.error_sms_code_message = error.response.data.non_field_errors[0];
                            } else {
                                this.error_sms_code_message = '数据有误';
                            }
                            this.error_sms_code = true;
                        } else {
                            console.log(error.response.data);
                        }

                    })
            }
        }
    }
});