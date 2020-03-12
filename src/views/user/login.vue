<template>
    <div class="login">
        <h1>登陆</h1>
        <el-form ref="form" :model="form" label-width="60px" class="form" :label-position="'left'">
            <el-form-item label="用户名">
                <el-input v-model="form.name" clearable placeholder="请输入用户名/手机号"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" show-password clearable placeholder="请输入密码"></el-input>
            </el-form-item>
        </el-form>
        <div class="controls">
            <el-button type="primary" @click="login">立即登陆</el-button>
            <el-button type="text" @click="register">点击注册>></el-button>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';

    export default {
        name: "login",
        data() {
            return {
                form: {
                    name: '',
                    password: '',
                }
            }
        },
        methods: {
            login() {
                this.$http.post('/api/login', this.form).then((res) => {
                    if (res.data.code === 200) {
                        document.cookie = 'token=' + res.data.data.token;
                        localStorage.setItem('token', res.data.data.token);
                        this.$store.commit('login', res.data.data);
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
                            });
                        Message.success({
                            message: '登陆成功',
                            customClass: 'small-message',
                            offset: 50,
                        });
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
                });
            },
            register() {
                this.$router.push('/register')
            },
        },
        created() {
            const win = this.$store.state.currentWindow;
            win.setBounds({ x: 550, y: 225, width: 335, height: 400 })
        }
    }
</script>

<style scoped lang="less">
    .login {
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
            margin: 60px auto 40px auto;
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
