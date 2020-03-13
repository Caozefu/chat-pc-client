<template>
    <div class="friend">
        <div class="message-list">
            <div class="top-drag header"></div>
            <div class="button-list">
                <div class="button-list-item">
                    <span>群聊</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="button-list-item" @click="request">
                    <span>
                        好友申请
                        <span class="unread-num" v-if="requestNum">{{requestNum}}</span>
                    </span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="button-list-item" @click="addFriend">
                    <span>添加好友</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="button-list-item" style="border: 0">
                    <span>好友列表</span>
                </div>
            </div>
            <el-scrollbar>
                <address-list :list-data="friendsList" />
            </el-scrollbar>
        </div>
        <div style="overflow: hidden">
            <search-friends v-if="contentType === 'add'" />
            <friend-request @get-friend="getFriend" v-if="contentType === 'req'" />
        </div>
    </div>
</template>

<script>
    import Pinyin from "../../utils/ChinesePY";
    import { mapState } from 'vuex';
    import { Message } from 'element-ui';
    import AddressList from "../../components/AddressList";
    import SearchFriends from "./searchFriends";
    import FriendRequest from './friendRequest'

    export default {
        name: "friends",
        data() {
            return {
                // msgNum: 0,
                // 原始好友列表
                // originalFriendsList: [],
                friendsList: {},
                requestNum: 0,
                contentType: ''
            }
        },
        components: {
            AddressList,
            SearchFriends,
            FriendRequest
        },
        methods: {
            // 格式化好友列表（按字母排序）
            formatFriendList(list) {
                const codeList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '#'];
                let res = {};
                codeList.forEach(code => res[code] = []);
                list.forEach(item => {
                    const code = Pinyin.getWordsCode(item.nickname)[0];
                    if (!res[code]) {
                        res['#'].push(item);
                    } else {
                        res[code].push(item);
                    }
                });
                return res;
            },
            // 好友详情
            friendDetail(id, name) {
                this.$router.push({
                    name: 'messageDetail',
                    query: {
                        name,
                        id
                    }
                });
            },
            // 添加好友
            addFriend() {
                this.contentType = 'add'
            },
            request() {
                this.contentType = 'req'
            },
            // 获取好友列表
            getFriend() {
                this.$http.get('/api/getFriends?id=' + this.userInfo.user_uid)
                    .then(res => {
                        this.$store.commit('updateFriendList', res.data.data);
                        this.originalFriendsList = res.data.data;
                        this.friendsList = this.formatFriendList(this.originalFriendsList);
                        console.log(this.friendsList);
                    })
                    .catch(() => {
                        Message.error('获取好友列表失败, 请刷新重试')
                    });
            },
            // 获取申请列表
            getRequest() {
                this.$http.get('/api/getRequest?id=' + this.userInfo.user_uid)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.requestNum = res.data.data.length;
                        } else {
                            Message.error(res.data.message);
                        }
                    })
                    .catch(() => {
                        Message.error('获取好友申请列表失败');
                    })
            }
        },
        created() {
            this.getFriend();
            setInterval(() => {
                this.getRequest();
            }, 5000);
        },
        activated() {
            this.getFriend();
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo',
                msgNum: 'msgNum'
            })
        }
    }
</script>

<style lang="less" scoped>
    .friend {
        height: 100vh;
        overflow: hidden;
        .header {
            height: 45px;
            box-sizing: border-box;
            border-bottom: 1px solid #e0e0e0;
        }
        .message-list {
            width: 200px;
            height: 100vh;
            box-sizing: border-box;
            padding: 0 15px;
            float: left;
            background-color: #fafafa;
            border-right: 1px solid #f0f0f0;
            .button-list-item {
                padding: 12px 0;
                border-bottom: 1px solid #e8eaec;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                .unread-num {
                    text-decoration: none;
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background-color: #f00;
                    text-align: center;
                    color: #fff;
                    line-height: 18px;
                }
            }
        }
    }
    .portrait {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        border-radius: 3px;
        margin-right: 10px;
    }
</style>
