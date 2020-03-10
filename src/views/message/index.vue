<template>
    <div class="message">
        <van-sticky>
            <van-nav-bar title="消息列表"/>
        </van-sticky>
        <van-cell-group>
            <van-cell v-for="(item, index) in messageList" :key="index" @click="toDetail(item.id, item.name)">
                <template slot="title">
                    <div class="message-list-left">
                        <div class="portrait">
                            <img :src="item.portrait" alt="">
                            <van-tag type="danger" v-if="getUnreadNum(item.id)">{{getUnreadNum(item.id)}}</van-tag>
                        </div>
                        <div class="custom-title">
                            <p class="user-name">{{item.name}}</p>
                            <p class="last-message">{{item.msg}}</p>
                        </div>
                    </div>
                </template>
                <span class="message-time">{{item.time | formatTime}}</span>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import io from "socket.io-client";
    import sortArrayByKey from "../../utils/sortArrayByKey";
    import { pushNotice } from "../../utils/notice";

    export default {
        name: "message",
        data() {
            return {
                messageList: [],
                messageCache: {
                    unreadNum: {}
                }
            }
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo',
            })
        },
        filters: {
            formatTime(value) {
                return `${new Date(value).getHours()}:${new Date(value).getMinutes()}`;
            }
        },
        methods: {
            toDetail(id, name) {
                this.$router.push({
                    name: 'messageDetail',
                    query: {
                        name,
                        id
                    }
                });
            },
            // 监听消息记录
            listenMessage() {
                this.IO = io.connect(process.env.VUE_APP_IO_URL);
                this.IO.on(this.userInfo.user_uid, (data) => {
                    this.setStorage(data);
                    // 发送通知
                    if (data.id !== this.userInfo.user_uid) pushNotice(data.name, data.portrait, data.msg);

                    let current = this.messageList.find(item => item.id === data.id);
                    if (current) {
                        const index = this.messageList.indexOf(current);
                        this.messageList.splice(index, 1);
                        this.messageList.unshift(data);
                    } else {
                        this.messageList.unshift(data);
                    }
                });
            },
            // 存储聊天记录
            setStorage(data) {
                const id = data.id;
                if (!this.messageCache[id]) {
                    this.messageCache[id] = [];
                    this.messageCache.unreadNum[id] = 0;
                }
                if (!this.messageCache.unreadNum[id]) this.messageCache.unreadNum[id] = 0;
                this.messageCache[id].push(data);
                this.messageCache.unreadNum[id]++;
                localStorage.setItem('message', JSON.stringify(this.messageCache));
                this.getTotalUnread();
            },
            // 从local获取聊天记录
            async getStorage() {
                const cache = JSON.parse(localStorage.getItem('message'));
                const arr = [];
                for (const key in cache) {
                    if (key === 'unreadNum') continue;
                    const item = cache[key][cache[key].length - 1];
                    // const i = this.friendList.find(v => v.user_uid == key);
                    const res = await this.$http.get('/api/searchFriendById?id=' + key);
                    const i = res.data.data[0] ? res.data.data[0] : {};
                    item.id = i.user_uid;
                    item.name = i.nickname;
                    item.portrait = i.portrait;
                    arr.push(item)
                }
                sortArrayByKey(arr, 'time');
                this.messageList = arr;
            },
            // 根据id获取未读消息条数
            getUnreadNum(id) {
                return this.messageCache.unreadNum[id] || 0;
            },
            // 获取所有未读消息
            getTotalUnread () {
                let num = 0;
                for (const key in this.messageCache.unreadNum) {
                    num += Number(this.messageCache.unreadNum[key])
                }
                console.log('总消息：', num);
                return num;
            }
        },
        created() {
            this.messageCache = JSON.parse(localStorage.getItem('message')) || {
                unreadNum: {}
            };
            this.listenMessage();
            this.getStorage();
        }
    }
</script>

<style lang="less">
    .top-fix {
        width: 100vw;
        position: fixed;
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
    .message-time {
        display: block;
        margin-top: 10px;
    }
    .message .van-cell {
        padding: 15px 16px;
    }
</style>
