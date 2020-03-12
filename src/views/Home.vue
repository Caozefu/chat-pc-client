<template>
    <div class="home">
        <div class="left-controls">
            <div class="top-drag"></div>
            <el-menu :default-active="activeRouter"
                     class="el-menu-vertical-demo"
                     :collapse="true"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b"
                     router>
                <el-menu-item index="/message">
                    <i class="el-icon-chat-dot-round"></i>
                    <span slot="title">消息</span>
                </el-menu-item>
                <el-menu-item index="/friends">
                    <i class="el-icon-user"></i>
                    <span slot="title">好友</span>
                </el-menu-item>
                <el-menu-item index="/setting">
                    <i class="el-icon-setting"></i>
                    <span slot="title">设置</span>
                </el-menu-item>
            </el-menu>
        </div>
        <keep-alive class="home-content">
            <router-view/>
        </keep-alive>
<!--        <van-tabbar route>-->
<!--            <van-tabbar-item replace icon="chat-o" to="/message">消息</van-tabbar-item>-->
<!--            <van-tabbar-item replace icon="friends-o" to="/friends" :info="msgNum ? msgNum : ''">好友</van-tabbar-item>-->
<!--            <van-tabbar-item replace icon="setting-o" to="/setting">设置</van-tabbar-item>-->
<!--        </van-tabbar>-->
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { mapState } from 'vuex';
    export default {
        name: 'home',
        computed: {
            ...mapState({
                userInfo: 'userInfo',
                msgNum: 'msgNum'
            }),
            activeRouter() {
                return this.$route.path
            }
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
                            Message.error(res.data.message);
                        }
                    })
                    .catch(() => {
                        Message.error('获取好友申请列表失败');
                    });
            }
        },
        created() {
            const win = this.$store.state.currentWindow;
            win.setBounds({ x: 200, y: 150, width: 900, height: 600 });
            // if (this.timer) clearInterval(this.timer);
            // this.timer = setInterval(() => {
            //     this.getRequest();
            // }, 1500);
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

<style scoped lang="less">
    .home {
        width: 100vw;
        height: 100vh;
        background-color: #f7f8fa;
        .left-controls {
            width: 80px;
            height: 100vh;
            background-color: #545c64;
            float: left;
        }
        & > div:last-child {
            overflow: hidden;
        }
    }
</style>

<style lang="less">
    .home {
        .el-menu--collapse {
            width: 80px;
            .el-tooltip {
                text-align: center;
            }
        }
        .el-menu {
            border-right: 0;
        }
    }
</style>
