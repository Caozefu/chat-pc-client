<template>
    <div class="search-friends">
        <div class="top-drag header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>好友列表</el-breadcrumb-item>
                <el-breadcrumb-item>添加好友</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search-content">
            <el-input placeholder="请输入用户名/手机号" v-model="searchKey" class="input-with-select" @keydown.enter.native="onSearch">
                <el-select v-model="select" slot="prepend" placeholder="请选择">
                    <el-option label="手机号" value="1" />
                    <el-option label="用户名" value="2" />
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="onSearch" />
            </el-input>
            <el-divider v-if="searchFlag && !searchResult.length">未搜索到相关用户</el-divider>
            <div class="search-result" v-else>
                <List>
                    <ListItem v-for="(item, index) in searchResult"
                              :key="index">
                        <ListItemMeta :avatar="item.portrait"
                                      :title="item.user_name"
                                      :description="item.nickname">
                        </ListItemMeta>
                        <template slot="action">
                            <li v-if="item.user_uid !== userInfo.user_uid">
                                <i class="el-icon-circle-plus-outline"
                                   @click="addFriend(item.user_uid)"
                                   style="font-size: 25px" />
                            </li>
                        </template>
                    </ListItem>
                </List>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import { mapState } from 'vuex';

    export default {
        name: "searchFriends",
        data() {
            return {
                searchKey: '',
                searchResult: [],
                searchFlag: false,
                requestNum: 0,
                select: '1'
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
            onSearch() {
                const key = this.searchKey.trim();
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
                        Message.error('搜索失败，请稍后重试')
                    })
            },
            addFriend(id) {
                this.$http.post('/api/addFriend', {id})
                    .then(res => {
                        if (res.data.code === 200) {
                            Message.success('添加好友申请已发送');
                        } else {
                            Message.error(res.data.message);
                        }
                    })
                    .catch(() => {
                        Message.error('添加失败，请稍后重试');
                    })
            }
        },
        created() {

        }
    }
</script>

<style lang="less" scoped>
    .search-friends {
        .header {
            height: 45px;
            box-sizing: border-box;
            padding: 10px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            align-items: center;
        }
        .search-content {
            padding: 10px;
            .search-result {
                padding: 10px 20px;
            }
        }
    }
</style>
<style lang="less">
    .search-content {
        .el-select {
            width: 88px;
        }
        .el-divider__text {
            background-color: #f7f8fa;
        }
    }
</style>
