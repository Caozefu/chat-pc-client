<template>
    <div class="message-detail">
        <template v-if="targetId !== -1">
            <div class="top-drag header">
                <el-page-header @back="back" :content="userName">
                </el-page-header>
            </div>
            <div class="message-content">
                <ul ref="message">
                    <li v-for="(item, index) in messageList" :key="index" :class="item.type ? 'own' : 'other'">
                        <img :src="item.portrait" alt="" v-if="!item.type">
                        <span class="message-part">{{item.msg}}</span>
                        <img :src="item.portrait" alt="" v-if="item.type">
                    </li>
                </ul>
            </div>
            <div class="message-input">
                <el-input class="input-area"
                          type="textarea"
                          :autosize="{ minRows: 4, maxRows: 4}"
                          resize="none"
                          placeholder="请输入内容"
                          v-model="msg"
                          id="inputArea">
                </el-input>

            </div>
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import io from "socket.io-client";
    const Mousetrap = require('mousetrap');

    export default {
        name: "messageDetail",
        data() {
            return {
                msg: '',
                IO: null,
                messageList: [],
                messageCache: {
                    unreadNum: {}
                }
            }
        },
        props: {
            userName: {
                type: String,
                default: ''
            },
            targetId: {
                type: Number,
                default: -1
            }
        },
        activated() {
            this.getStorage();
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        created() {
            this.messageCache = JSON.parse(localStorage.getItem('message')) || {unreadNum: {}};
            this.IO = io.connect(process.env.VUE_APP_IO_URL);
            this.IO.on(this.userInfo.user_uid, (data) => {
                // filter
                if ((data.id === this.userInfo.user_uid && data.target === this.targetId) || (data.id === this.targetId && data.target === this.userInfo.user_uid)) {
                    const type = {type: this.userInfo.user_uid === data.id};
                    this.messageList.push(Object.assign(data, type));
                    this.setStorage(Object.assign(data, type));
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    });
                }
            });
            this.getStorage();
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        watch: {
            targetId(val) {
                if (val === -1) return;
                this.getStorage();
                this.$nextTick(() => {
                    this.initMouseEvent();
                    this.scrollToBottom();
                });
            }
        },
        methods: {
            // 发送信息
            send() {
                if (!this.msg.trim()) return;
                this.IO.emit('chat message', {
                    portrait: this.userInfo.portrait,
                    name: this.userInfo.nickname,
                    id: this.userInfo.user_uid,
                    msg: this.msg,
                    target: this.targetId,
                    time: new Date().getTime()
                });
                this.msg = '';
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            },
            back() {
                this.$router.back();
            },
            // 滚动到屏幕底部
            scrollToBottom() {
                if (!this.$refs['message']) return;
                const h = this.$refs['message'].scrollHeight;
                this.$refs['message'].scrollTop = h;
            },
            // 存储聊天记录
            setStorage(data) {
                const id = this.targetId;
                if (!this.messageCache[id]) this.messageCache[id] = [];
                this.messageCache[id].push(data);
                localStorage.setItem('message', JSON.stringify(this.messageCache));
            },
            // 获取聊天记录
            getStorage() {
                const cache = JSON.parse(localStorage.getItem('message'));
                if (cache && cache[this.targetId]) {
                    this.messageList = cache[this.targetId];
                    cache.unreadNum[this.targetId] = 0;
                    localStorage.setItem('message', JSON.stringify(cache))
                }
            },
            initMouseEvent() {
                const text = document.querySelector('#inputArea');
                Mousetrap(text).bind('command+enter', (e) => {
                    e.stopPropagation();
                    this.msg += '\n';
                });
                text.addEventListener('keydown', (e) => {
                    if (e.keyCode === 13) {
                        e.preventDefault();
                        this.send();
                    }
                })
            }
        },
        mounted() {
            this.scrollToBottom();
        }
    }
</script>

<style lang="less" scoped>
    .message-detail {
        height: 100vh;
        background-color: #ededed;
        .header {
            height: 45px;
            box-sizing: border-box;
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
        }
    }
    .message-content {
        margin: 0 10px;
        & > ul {
            height: calc(100vh - 170px);
            overflow-y: auto;
        }
        & > ul li {
            margin-top: 15px;
            display: flex;
            align-items: flex-start;
            padding: 0 10px;
            &:last-child {
                margin-bottom: 15px;
            }
            & > img {
                display: block;
                width: 45px;
                height: 45px;
                float: left;
                margin-right: 15px;
            }
            .message-part {
                max-width: calc(100vw - 100px);
                display: block;
                line-height: 45px;
                background-color: #fefefe;
                float: left;
                padding: 0 10px;
                border-radius: 5px;
                word-break: break-all;
                position: relative;
            }
            &.other {
                .message-part:after {
                    content: '';
                    display: block;
                    border: 5px solid transparent;
                    border-right-color: #fefefe;
                    position: absolute;
                    top: 20px;
                    left: -10px;
                    transform: translateY(-50%);
                }
            }
            &.own {
                justify-content: flex-end;
                & > img {
                    margin-left: 15px;
                    margin-right: 0;
                }
                .message-part {
                    background-color: #abe97c;
                    &:after {
                        content: '';
                        display: block;
                        border: 5px solid transparent;
                        border-left-color: #abe97c;
                        position: absolute;
                        top: 20px;
                        right: -10px;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }

    .message-input {
        padding: 15px;
        height: 150px;
        border-top: 1px solid #e0e0e0;
        .input-area {}
    }
    .input-bar {
        box-sizing: border-box;
        padding: 10px 16px;
        background-color: #ededed;
        box-shadow: 1px 1px 10px 1px #ccc;
    }
</style>
