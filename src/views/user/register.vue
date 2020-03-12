<template>
    <div class="register">
        <h1>注册</h1>
        <avatar-upload @upload="upload" :image-url="portUrl"/>
        <el-form ref="form" :model="form" label-width="60px" class="form" :label-position="'left'">
            <el-form-item label="用户名">
                <el-input v-model="form.name" clearable placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" show-password clearable placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="form.phone" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
        </el-form>
        <div class="controls">
            <el-button type="primary" @click="register">点击注册</el-button>
            <el-button type="text" @click="toLogin">已有账号，去登陆>></el-button>
        </div>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import AvatarUpload from "../../components/AvatarUpload";

    export default {
        name: "register",
        data() {
            return {
                fileList: [],
                portUrl: '',
                form: {
                    name: '',
                    password: '',
                    phone: ''
                }
            }
        },
        components: {
            AvatarUpload
        },
        methods: {
            register() {
                if (!this.checkField()) return;
                this.$http.post('/api/register', Object.assign(this.form, {
                    portrait: this.portUrl
                })).then(res => {
                    if (res.data.code === 500) {
                        Message.error({
                            message: res.data.message,
                            customClass: 'small-message',
                            offset: 50,
                        });
                    } else {
                        Message.success({
                            message: '注册成功',
                            customClass: 'small-message',
                            offset: 50,
                        });
                        this.login();
                    }
                }).catch(e => {
                    Message.error({
                        message: e,
                        customClass: 'small-message',
                        offset: 50,
                    });
                })
            },
            login() {
                this.$http.post('/api/login', this.form).then((res) => {
                    if (res.data.code === 200) {
                        document.cookie = 'token=' + res.data.data.token;
                        localStorage.setItem('token', res.data.data.token);
                        this.$store.commit('login', {});
                        Message.success({
                            message: '登陆成功',
                            customClass: 'small-message',
                            offset: 50,
                        });
                        this.$http.get('/api/getUserInfo')
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$store.commit('login', res.data.data);
                                } else {
                                    Message.error({
                                        message: '请先登陆',
                                        customClass: 'small-message',
                                        offset: 50,
                                    });
                                    this.$store.commit('logout');
                                }
                            })
                            .catch(() => {
                                Message.error({
                                    message: '请先登陆',
                                    customClass: 'small-message',
                                    offset: 50,
                                });
                            })
                        this.$router.push('/');
                    } else {
                        Message.error({
                            message: res.data.message,
                            customClass: 'small-message',
                            offset: 50,
                        });
                    }
                }).catch(e => {
                    Message.error({
                        message: e,
                        customClass: 'small-message',
                        offset: 50,
                    });
                })
            },
            // 表单校验
            checkField() {
                if (!this.portUrl) {
                    Message.info({
                        message: '请上传头像',
                        customClass: 'small-message',
                        offset: 50,
                    });
                    return false;
                }
                if (!this.form.name) {
                    Message.info({
                        message: '请输入用户名',
                        customClass: 'small-message',
                        offset: 50,
                    });
                    return false;
                }
                if (!this.form.password) {
                    Message.info({
                        message: '请输入密码',
                        customClass: 'small-message',
                        offset: 50,
                    });
                    return false;
                }
                if (!this.form.phone) {
                    Message.info({
                        message: '请输入手机号',
                        customClass: 'small-message',
                        offset: 50,
                    });
                    return false;
                }
                if (this.form.phone.length !== 11) {
                    Message.info({
                        message: '手机号格式有误',
                        customClass: 'small-message',
                        offset: 50,
                    });
                    return false;
                }
                return true
            },
            // 上传头像
            upload(file) {
                const params = new FormData();
                params.append('portrait', file);
                this.$http.post('/api/upload', params).then(res => {
                    if (res.data.code === 500) {
                        Message.error({
                            message: res.data.message,
                            customClass: 'small-message',
                            offset: 50,
                        });
                    } else {
                        this.portUrl = res.data.url;
                    }
                }).catch(e => {
                    Message.error({
                        message: e,
                        customClass: 'small-message',
                        offset: 50,
                    });
                })
            },
            toLogin() {
                this.$router.push('/login')
            }
        },
        created() {
            const win = this.$store.state.currentWindow;
            win.setBounds({y: 180, height: 550});
        }
    }
</script>

<style scoped lang="less">
    .register {
        & > h1 {
            text-align: center;
            background-color: #262626;
            font-size: 16px;
            color: #fff;
            font-weight: normal;
            line-height: 45px;
        }

        .form {
            width: 80%;
            margin: 40px auto 40px auto;
        }

        .controls {
            width: 80%;
            margin: 20px auto;

            button {
                display: block;

                &:first-child {
                    width: 100%;
                }

                &:last-child {
                    float: right;
                }
            }
        }
    }
</style>
