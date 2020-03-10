<template>
    <div class="setting-detail">
        <van-nav-bar title="个人信息" left-arrow @click-left="back"></van-nav-bar>
        <van-cell-group>
            <van-cell is-link @click="changePortrait">
                <template slot="title">
                    <span class="custom-title">头像</span>
                </template>
                <img class="user-portrait" :src="userInfo.portrait" alt="">
            </van-cell>
            <van-cell title="昵称" is-link :value="userInfo.nickname" @click="openPopup('昵称', userInfo.nickname, 'nickname')"></van-cell>
            <van-cell title="用户名" :value="userInfo.user_name"></van-cell>
            <van-cell title="性别" is-link :value="userInfo.sex | formatSex" @click="openPopup('性别', userInfo.sex, 'sex')"></van-cell>
            <van-cell title="手机号" is-link :value="userInfo.phone" @click="openPopup('手机号', userInfo.phone, 'phone')"></van-cell>
        </van-cell-group>
        <!-- 修改用户信息 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '18%', background: '#ededed' }">
            <van-cell-group style="margin-top: 2vh;margin-bottom: 2vh">
                <van-field
                        v-model="newValue"
                        :label="popupLabel"
                        :placeholder="popupValue"
                        clearable
                        autofocus
                ></van-field>
            </van-cell-group>
            <div class="confirm-buttons">
                <van-button type="primary" @click="confirm()">保存</van-button>
                <van-button type="warning" @click="show = false">取消</van-button>
            </div>
        </van-popup>
        <!-- 修改性别 -->
        <van-popup v-model="showSexSelection" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showSexSelection = false"
                    @confirm="onSexConfirm"
                    :default-index="sex"
            />
        </van-popup>
        <!-- 修改头像 -->
        <van-action-sheet v-model="showPortraitSelection" title="请选择头像">
            <van-row type="flex" justify="center">
                <van-uploader v-model="fileList" :max-count="1" style="margin-top: 2vh;"/>
            </van-row>
            <div class="confirm-buttons">
                <van-button style="width: 100px; margin-top: 1vh; margin-bottom: 2vh" type="primary" @click="savePort()">保存</van-button>
            </div>
        </van-action-sheet>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {Toast} from 'vant';

    export default {
        name: "settingDetail",
        data() {
            return {
                show: false,
                popupLabel: '',
                popupValue: '',
                newValue: '',
                type: '',
                sex: 0,
                showSexSelection: false,
                showPortraitSelection: false,
                columns: ['男', '女'],
                fileList: []
            }
        },
        methods: {
            back() {
                this.$router.push('/setting');
            },
            // 修改头像
            changePortrait() {
                this.fileList = [];
                this.showPortraitSelection = true;
            },
            // 保存头像
            savePort() {
                const params = new FormData();
                params.append('portrait', this.fileList[0].file);
                this.$http.post('/api/upload', params).then(res => {
                    if (res.data.code === 500) {
                        Toast.fail(res.data.message);
                    } else {
                        this.type = 'portrait';
                        this.newValue = res.data.url;
                        this.confirm();
                    }
                }).catch(e => {
                    Toast.fail(e);
                })
            },
            // 打开弹窗
            openPopup(label, value, type) {
                if (type === 'sex') {
                    this.showSexSelection = true;
                    this.sex = value;
                    this.type = type;
                    return;
                }
                this.show = true;
                this.popupLabel = label;
                this.popupValue = value;
                this.type = type;
            },
            // 确认修改性别
            onSexConfirm(val) {
                this.newValue = val === '男' ? 0 : 1;
                this.confirm();
            },
            // 确认修改信息
            confirm() {
                if (!this.newValue && this.newValue !== 0) return;
                this.$http.post('/api/updateUserInfo', {
                    key: this.type,
                    value: this.newValue
                }).then(res => {
                    if (res.data.code === 200) {
                        Toast.success('修改成功');
                        this.show = false;
                        this.showSexSelection = false;
                        this.showPortraitSelection = false;
                        this.newValue = '';
                        this.updateUserInfo()
                    } else {
                        Toast.fail(res.data.message);
                    }
                }).catch(() => {
                    Toast.fail('修改失败，请稍后重试');
                })
            },
            // 更改用户信息接口
            updateUserInfo() {
                this.$http.get('/api/getUserInfo')
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$store.commit('login', res.data.data);
                        } else {
                            Toast.fail('获取用户信息失败');
                            this.$store.commit('logout');
                        }
                    })
                    .catch(() => {
                        Toast.fail('获取用户信息失败');
                    })
            }
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        filters: {
            formatSex(val) {
                switch (val) {
                    case 1:
                        return '女';
                        break;
                    case 0:
                        return '男';
                        break;
                    case -1:
                        return '暂未设置';
                        break;
                }
            }
        }
    }
</script>

<style lang="less">
    .setting-detail {
        .van-cell {
            display: flex;
            align-items: center;
        }
        .user-portrait {
            display: block;
            float: right;
            width: 12vw;
            height: 12vw;
        }
        .confirm-buttons {
            display: flex;
            justify-content: space-around;
            & > button {
                width: 35vw;
            }
        }
    }
</style>
