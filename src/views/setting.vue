<template>
    <div class="setting">
        <van-sticky>
            <van-nav-bar title="设置"/>
        </van-sticky>
        <van-cell-group>
            <van-cell is-link class="user-info" @click="toDetail">
                <template slot="title">
                    <div class="message-list-left">
                        <div class="portrait">
                            <img :src="userInfo.portrait" alt="">
                        </div>
                        <div class="custom-title">
                            <p class="user-name">{{userInfo.nickname}}</p>
                            <p class="last-message">用户名: {{userInfo.user_name}}</p>
                        </div>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group style="margin-top: 1vh; margin-bottom: 1vh;">
            <van-cell title="关于我们" is-link to="" />
        </van-cell-group>
        <van-button type="primary" size="large" @click="logout">退出登陆</van-button>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {Toast} from 'vant';

    export default {
        name: "setting",
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        methods: {
            logout() {
                Toast.success('已退出登陆');
                this.$store.commit('logout');
                localStorage.removeItem('token');
                this.$router.push('/login')
            },
            toDetail() {
                this.$router.push('/setting-detail')
            }
        },
        mounted() {
        }
    }
</script>

<style lang="less" scoped>
.user-info {
    display: flex;
    align-items: center;
}
.message-list-left {
    display: flex;
    align-items: center;
    .portrait {
        width: 50px;
        height: 50px;
        /*overflow: hidden;*/
        position: relative;
        & > img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
        .van-tag {
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            right: -9px;
            top: -9px;
            padding: 0;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
        }
    }
    .custom-title {
        line-height: 10px;
        margin-left: 10px;
        .user-name {
            font-weight: 900;
            font-size: 18px;
            /*overflow: hidden;*/
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 24px;
            margin: 0;
        }
        .last-message {
            margin: 0;
            line-height: 28px;
            font-size: 14px;
            color: #999;
            max-width: 60vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
