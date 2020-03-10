<template>
    <div class="friend-request">
        <van-nav-bar title="好友申请列表" left-arrow @click-left="back"></van-nav-bar>
        <van-cell-group class="friend-list">
            <van-cell v-for="(item, index) in requestList" :key="index">
                <template slot="title">
                    <div class="message-list-left">
                        <div class="portrait">
                            <img :src="item.portrait" alt="">
                        </div>
                        <div class="custom-title">
                            <p class="user-name">{{item.nickname}}</p>
                            <p class="last-message">{{item.nickname}}</p>
                        </div>
                    </div>
                </template>
                <div class="operate">
                    <van-button type="primary" size="small" @click="apply(item.user_uid)">同意</van-button>
                    <van-button type="danger" size="small">拒绝</van-button>
                    <van-button type="warning" size="small">忽略</van-button>
                </div>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
    import {Toast} from 'vant';
    import { Notify } from 'vant';
    import { mapState } from 'vuex';
    export default {
        name: "friendRequest",
        data() {
            return {
                requestList: []
            }
        },
        methods: {
            back() {
                this.$router.back();
            },
            // 同意申请
            apply(id) {
                this.$http.post('/api/applyFriend', { id })
                    .then(res => {
                        if (res.data.code === 200) {
                            Toast.success('添加成功');
                            this.getRequest();
                        } else {
                            Toast.fail(res.data.message);
                            this.getRequest();
                        }
                    })
                    .catch(() => {
                        Notify({ type: 'danger', message: '服务器异常，请稍后重试' });
                    })
            },
            // 获取申请列表
            getRequest() {
                this.$http.get('/api/getRequest?id=' + this.userInfo.user_uid)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.requestList = res.data.data;
                        } else {
                            Toast.fail(res.data.message);
                        }
                    })
                    .catch(() => {
                        Toast.fail('获取好友申请列表失败');
                    })
            }
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        created() {
            this.getRequest();
        }
    }
</script>

<style lang="less" scoped>
    .message-list-left {
        display: flex;
        align-items: center;
        .portrait {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            overflow: hidden;
            & > img {
                width: 100%;
                height: 100%;
            }
        }
        .custom-title {
            line-height: 10px;
            margin-left: 10px;
            .user-name {
                line-height: 46px;
                max-width: 30vw;
                font-weight: 900;
                font-size: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .last-message {
                font-size: 14px;
                color: #999;
            }
        }
    }
    .message-time {
        display: block;
        margin-top: 10px;
    }
</style>
<style lang="less">
    .friend-list .van-cell__value {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .operate {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
</style>
