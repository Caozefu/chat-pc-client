<template>
    <div class="search-friends">
        <van-nav-bar title="添加好友" left-arrow @click-left="back">
        </van-nav-bar>
        <van-cell-group>
            <van-cell is-link to="/friends-request">
                <template slot="title">
                    <span>好友申请  </span>
                    <van-tag round type="danger" v-if="requestNum > 0">{{requestNum}}</van-tag>
                </template>
            </van-cell>
        </van-cell-group>
        <van-search
                v-model="searchKey"
                placeholder="请输入用户名/手机号"
                show-action
                @search="onSearch"
        >
            <div slot="action" @click="onSearch(searchKey)">搜索</div>
        </van-search>
        <van-divider v-if="searchFlag && !searchResult.length">未搜索到相关用户</van-divider>
        <van-cell-group class="friend-list" v-else>
            <van-cell v-for="(item, index) in searchResult" :key="index">
                <template slot="title">
                    <div class="message-list-left">
                        <div class="portrait">
                            <img :src="item.portrait" alt="">
                        </div>
                        <div class="custom-title">
                            <p class="user-name">{{item.nickname}}</p>
                            <p class="last-message">用户名：{{item.user_name}}</p>
                        </div>
                    </div>
                </template>
                <van-icon name="add-o"
                          size="25px"
                          @click="addFriend(item.user_uid)" v-if="item.user_uid !== userInfo.user_uid"></van-icon>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
    import {Toast} from 'vant';
    import { mapState } from 'vuex';

    export default {
        name: "searchFriends",
        data() {
            return {
                searchKey: '',
                searchResult: [],
                searchFlag: false,
                requestNum: 0
            }
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        methods: {
            back() {
                this.$router.back();
            },
            onSearch(key) {
                if (!key) return;
                this.$http.get('/api/searchFriends?key=' + key)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.searchResult = res.data.data;
                            this.searchFlag = true;
                        } else {
                            this.searchResult = [];
                            this.searchFlag = true;
                        }
                    })
                    .catch(() => {
                        Toast.fail('搜索失败，请稍后重试')
                    })
            },
            addFriend(id) {
                this.$http.post('/api/addFriend', {id})
                    .then(res => {
                        if (res.data.code === 200) {
                            Toast.success('添加好友申请已发送');
                        } else {
                            Toast.fail(res.data.message);
                        }
                    })
                    .catch(() => {
                        Toast.fail('添加失败，请稍后重试');
                    })
            }
        },
        created() {
            this.$http.get('/api/getRequest?id=' + this.userInfo.user_uid)
                .then(res => {
                    if (res.data.code === 200) {
                        this.requestNum = res.data.data.length;
                    } else {
                        Toast.fail(res.data.message);
                    }
                })
                .catch(() => {
                    Toast.fail('获取好友申请列表失败');
                })
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
                font-weight: 900;
                font-size: 18px;
                /*overflow: hidden;*/
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
    }
</style>
