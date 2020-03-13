<template>
    <div class="friend-request">
        <div class="top-drag header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>好友列表</el-breadcrumb-item>
                <el-breadcrumb-item>好友申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search-content">
            <el-divider v-if="requestList && !requestList.length">暂无好友申请</el-divider>
            <div class="search-result" v-else>
                <List>
                    <ListItem v-for="(item, index) in requestList"
                              :key="index">
                        <ListItemMeta :avatar="item.portrait"
                                      :title="item.user_name"
                                      :description="item.nickname">
                        </ListItemMeta>
                        <template slot="action">
                            <li>
                                <el-button type="success" plain size="mini" @click="apply(item.user_uid)">同意</el-button>
                            </li>
                            <li>
                                <el-button type="danger" plain size="mini">拒绝</el-button>
                            </li>
                            <li>
                                <el-button type="info" plain size="mini">忽略</el-button>
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
    // import { Notify } from 'vant';
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
                            Message.success('添加成功');
                            this.getRequest();
                            this.$emit('get-friend');
                        } else {
                            Message.error(res.data.message);
                            this.getRequest();
                        }
                    })
                    .catch(() => {
                        // Notify({ type: 'danger', message: '服务器异常，请稍后重试' });
                    })
            },
            // 获取申请列表
            getRequest() {
                this.$http.get('/api/getRequest?id=' + this.userInfo.user_uid)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.requestList = res.data.data;
                        } else {
                            Message.error(res.data.message);
                        }
                    })
                    .catch(() => {
                        Message.error('获取好友申请列表失败');
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
    .friend-request {
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
