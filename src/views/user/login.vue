<template>
    <div class="register">
        <van-nav-bar title="登录"/>
        <van-cell-group>
            <van-field
                    v-model="username"
                    required
                    clearable
                    label="用户名"
                    placeholder="请输入用户名/手机号"
            />
            <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
                    required
            />
        </van-cell-group>
        <van-row type="flex" justify="center" style="margin-top: 2vh;">
            <van-button plain hairline style="margin-right: 2vw;" type="primary" @click="login">立即登陆</van-button>
            <van-button plain hairline type="info" @click="register">点击注册</van-button>
        </van-row>
    </div>
</template>

<script>
    import {Toast} from 'vant';

    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: '',
            }
        },
        methods: {
            login() {
                this.$http.post('/api/login', {
                    name: this.username,
                    password: this.password
                }).then((res) => {
                    if (res.data.code === 200) {
                        document.cookie = 'token=' + res.data.data.token;
                        localStorage.setItem('token', res.data.data.token);
                        this.$store.commit('login', res.data.data);
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
                            });
                        Toast.success('登陆成功');
                        this.$router.push('/');
                    } else {
                        Toast.fail(res.data.message);
                    }
                }).catch(e => {
                    Toast.fail(e);
                });
            },
            register() {
                this.$router.push('/register')
            }
        }
    }
</script>

<style scoped>

</style>
