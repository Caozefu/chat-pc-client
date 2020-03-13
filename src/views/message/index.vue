<template>
    <div class="message">
        <div class="message-list">
            <div class="top-drag"></div>
            <List>
                <ListItem v-for="(item, index) in messageList"
                          :key="index"
                          @click.native="toDetail(item.id, item.name)"
                          class="list-item"
                          :class="{'active': item.id === targetId}">
                    <ListItemMeta :title="item.name"
                                  :description="item.msg">
                        <template slot="avatar">
                            <el-badge :value="getUnreadNum(item.id)" class="item" v-if="getUnreadNum(item.id)">
                                <img :src="item.portrait" alt="" style="width: 45px;">
                            </el-badge>
                            <img :src="item.portrait" alt="" style="width: 45px;" v-else>
                        </template>
                    </ListItemMeta>

                    <template slot="action">
                        <li>
                            <span>{{item.time | formatTime}}</span>
                        </li>
                    </template>
                </ListItem>
            </List>
        </div>
        <div style="overflow: hidden">
            <message-detail :user-name="userName" :target-id="targetId" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import io from "socket.io-client";
    import sortArrayByKey from "../../utils/sortArrayByKey";
    import MessageDetail from "./messageDetail";
    import { createNotice } from "../../utils/notice";

    export default {
        name: "message",
        data() {
            return {
                messageList: [],
                messageCache: {
                    unreadNum: {}
                },
                userName: '',
                targetId: -1
            }
        },
        components: {
            MessageDetail
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo',
            }),
            // userName() {
            //     return this.$route.query.name || '';
            // },
            // targetId() {
            //     return this.$route.query.id || -1;
            // }
        },
        watch: {
            $route: {
                handler(val) {
                    if (!val.query.name) return;
                    this.userName = val.query.name;
                    this.targetId = val.query.id;
                },
                deep: true
            }
        },
        filters: {
            formatTime(value) {
                const minute = new Date(value).getMinutes();
                return `${new Date(value).getHours()}:${minute < 10 ? '0' + minute : minute}`;
            }
        },
        methods: {
            toDetail(id, name) {
                // this.$router.push({
                //     name: 'messageDetail',
                //     query: {
                //         name,
                //         id
                //     }
                // });
                this.targetId = id;
                this.userName = name;
            },
            // 监听消息记录
            listenMessage() {
                this.IO = io.connect(process.env.VUE_APP_IO_URL);
                this.IO.on(this.userInfo.user_uid, (data) => {
                    const id = data.id;
                    if (id === this.userInfo.user_uid) {
                        // 当前用户发送的消息
                        this.setStorage(data, 1);
                        this.getStorage();
                        return;
                    }

                    // 接收其他用户的消息
                    this.setStorage(data, 0);
                    // 发送通知
                    createNotice(data.name, data.portrait, data.msg);
                    // if (data.id !== this.userInfo.user_uid) pushNotice(data.name, data.portrait, data.msg);

                    // let current = this.messageList.find(item => item.id === data.id);
                    // if (current) {
                    //     const index = this.messageList.indexOf(current);
                    //     this.messageList.splice(index, 1);
                    //     this.messageList.unshift(data);
                    // } else {
                    //     this.messageList.unshift(data);
                    // }
                    this.getStorage();
                });
            },
            /** 存储聊天记录,
             * status: 0 其他用户， 1 当前用户
             * */
            setStorage(data, status) {
                const id = status ? data.target : data.id;
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
    .message {
        .message-list {
            float: left;
            width: 265px;
            background-color: #fafafa;
            height: 100vh;
            /*padding: 0 15px;*/
            box-sizing: border-box;
            .top-drag {
                height: 45px;
                border-bottom: 1px solid #e0e0e0;
            }
            .ivu-list-item-meta-description {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 83px;
            }
            .ivu-list-item {
                cursor: pointer;
            }
            .list-item {
                padding: 12px 15px;
            }
            .active {
                background-color: #d6d6d6;
            }
        }
    }
</style>
