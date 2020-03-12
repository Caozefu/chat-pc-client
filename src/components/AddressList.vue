<template>
    <div class="address-list">
        <div>
            <template v-for="(value, key, index) of listData">
                <div :key="index" v-if="value.length">
                    <div class="list-title">
                        <span>{{key.toUpperCase()}}</span>
                    </div>
                    <List>
                        <ListItem v-for="(item, sub_index) in value"
                                  :key="sub_index"
                                  style="cursor: pointer"
                                  @click.native="friendDetail(item.user_uid, item.nickname)">
                            <ListItemMeta :avatar="item.portrait"
                                          :title="item.nickname"/>
                        </ListItem>
                    </List>

                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddressList",
        props: {
            listData: {
                type: Object,
                default: () => {
                }
            }
        },
        methods: {
            // 进入聊天窗口
            friendDetail(id, name) {
                this.$router.push({
                    name: 'message',
                    query: {
                        name,
                        id
                    }
                });
            },
        }
    }
</script>

<style scoped lang="less">
    .address-list {
        height: 100%;
        max-width: 200px;

        .list-title {
            border-bottom: 1px solid #e0e0e0;
            box-sizing: border-box;
            padding-left: 10px;
            line-height: 30px;
        }
    }
</style>

<style lang="less">
    .address-list {
        .ivu-list-item-meta {
            align-items: center;
        }
        .ivu-list-item-meta-title {
            margin-bottom: 0;
        }
    }
</style>
