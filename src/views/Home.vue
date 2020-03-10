<template>
    <div class="home">
        <keep-alive>
            <router-view/>
        </keep-alive>
        <van-tabbar route>
            <van-tabbar-item replace icon="chat-o" to="/message">消息</van-tabbar-item>
            <van-tabbar-item replace icon="friends-o" to="/friends" :info="msgNum ? msgNum : ''">好友</van-tabbar-item>
            <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import {Toast} from 'vant';
    import { mapState } from 'vuex';
    export default {
        name: 'home',
        computed: {
            ...mapState({
                userInfo: 'userInfo',
                msgNum: 'msgNum'
            })
        },
        data() {
            return {
                timer: null
            }
        },
        methods: {
            getRequest() {
                this.$http.get('/api/getRequest?id=' + this.userInfo.user_uid)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$store.commit('requestNum', res.data.data.length)
                            // this.msgNum = res.data.data.length;
                        } else {
                            Toast.fail(res.data.message);
                        }
                    })
                    .catch(() => {
                        Toast.fail('获取好友申请列表失败');
                    });
            }
        },
        created() {
            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.getRequest();
            }, 1500);
        },
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer);
            next();
        },
        beforeRouteEnter(to, from, next) {
            if (to.name === 'home') {
                next('/message')
            } else {
                next()
            }
        }
    }
</script>

<style>
    .home {
        width: 100vw;
        height: 100vh;
        background-color: #f7f8fa;
    }
</style>
