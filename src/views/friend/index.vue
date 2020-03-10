<template>
    <div class="setting">
        <van-nav-bar title="好友列表"/>
        <van-grid :column-num="2">
            <van-grid-item icon="home-o" text="群聊" dot/>
            <van-grid-item icon="search" text="添加好友" :info="msgNum ? msgNum : ''" @click="addFriend"/>
        </van-grid>
        <van-index-bar style="height: calc(100vh - 180px); overflow-y: scroll">
            <template v-for="(value, key, index) in friendsList">
                <template v-if="value.length">
                    <van-index-anchor :index="key.toUpperCase()" :key="index"></van-index-anchor>
                    <van-cell v-for="(sub_item, sub_index) in value"
                              :key="sub_index" @click="friendDetail(sub_item.user_uid, sub_item.nickname)">
                        <template slot="title">
                            <img :src="sub_item.portrait" alt="" class="portrait">
                            <span class="custom-title">{{sub_item.nickname}}</span>
                        </template>
                    </van-cell>
                </template>
            </template>
        </van-index-bar>
    </div>
</template>

<script>
    import Pinyin from "../../utils/ChinesePY";
    import { mapState } from 'vuex';
    import {Toast} from 'vant';

    export default {
        name: "friends",
        data() {
            return {
                // msgNum: 0,
                // 原始好友列表
                // originalFriendsList: [],
                friendsList: {},
            }
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
                this.$router.push('/search-friends');
            },
            // 获取好友列表
            getFriend() {
                this.$http.get('/api/getFriends?id=' + this.userInfo.user_uid)
                    .then(res => {
                        this.$store.commit('updateFriendList', res.data.data);
                        this.originalFriendsList = res.data.data;
                        this.friendsList = this.formatFriendList(this.originalFriendsList);
                    })
                    .catch(() => {
                        Toast.fail('获取好友列表失败, 请刷新重试')
                    });
            },
        },
        created() {
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
    .setting {
        height: 100vh;
        overflow: hidden;
    }
    .portrait {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        border-radius: 3px;
        margin-right: 10px;
    }
</style>
