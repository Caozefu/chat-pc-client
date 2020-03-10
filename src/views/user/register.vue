<template>
    <div class="register">
        <van-nav-bar title="注册"/>
        <van-row type="flex" justify="center" style="margin-top: 4vh;">
            <van-uploader v-model="fileList" :max-count="1" :after-read="upload"/>
        </van-row>
        <van-row type="flex" justify="center">
            <p>头像</p>
        </van-row>
        <van-cell-group>
            <van-field
                    v-model="username"
                    required
                    clearable
                    label="用户名"
                    placeholder="请输入用户名"
            ></van-field>
            <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    required
            ></van-field>
            <van-field
                    v-model="phone"
                    type="number"
                    label="手机号"
                    placeholder="请输入手机号"
                    required
            ></van-field>
        </van-cell-group>
        <van-row type="flex" justify="center" style="margin-top: 2vh;">
            <van-button plain hairline type="primary" @click="register">点击注册</van-button>
        </van-row>
    </div>
</template>

<script>
    import { Toast } from 'vant';
    export default {
        name: "register",
        data() {
            return {
                fileList: [],
                username: '',
                password: '',
                phone: ''
            }
        },
        methods: {
            register() {
                if (this.checkField()) return;
                this.$http.post('/api/register', {
                    name: this.username,
                    password: this.password,
                    phone: this.phone,
                    portrait: this.portUrl
                }).then(res => {
                    if (res.data.code === 500) {
                        Toast.fail(res.data.message);
                    } else {
                        Toast.success('注册成功');
                        this.login();
                    }
                }).catch(e => {
                    Toast.fail(e);
                })
            },
            login() {
                this.$http.post('/api/login', {
                    name: this.username,
                    password: this.password
                }).then((res) => {
                    if (res.data.code === 200) {
                        document.cookie = 'token=' + res.data.data.token;
                        localStorage.setItem('token', res.data.data.token);
                        this.$store.commit('login', {});
                        Toast.success('登陆成功');
                        this.$http.get('/api/getUserInfo')
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$store.commit('login', res.data.data);
                                } else {
                                    Toast.fail('请先登陆');
                                    this.$store.commit('logout');
                                }
                            })
                            .catch(() => {
                                Toast.fail('请先登陆');
                            })
                        this.$router.push('/');
                    } else {
                        Toast.fail(res.data.message);
                    }
                }).catch(e => {
                    Toast.fail(e);
                })
            },
            // 表单校验
            checkField() {
                if (!this.fileList.length) {
                    Toast('请上传头像');
                    return false;
                }
                if (!this.username) {
                    Toast('请输入用户名');
                    return false;
                }
                if (!this.password) {
                    Toast('请输入密码');
                    return false;
                }
                if (!this.phone) {
                    Toast('请输入手机号');
                    return false;
                }
                if (this.phone.length !== 11) {
                    Toast('手机号格式有误');
                    return false;
                }
            },
            // 上传头像
            upload(file) {
                const params = new FormData();
                params.append('portrait', file.file);
                this.$http.post('/api/upload', params).then(res => {
                    if (res.data.code === 500) {
                        Toast.fail(res.data.message);
                    } else {
                        this.portUrl = res.data.url;
                    }
                }).catch(e => {
                    Toast.fail(e);
                })
            }
        }
    }
</script>

<style scoped>

</style>
