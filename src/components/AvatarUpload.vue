<template>
    <div class="avatar-upload">
        <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "AvatarUpload",
        data() {
            return {
                file: null
            }
        },
        props: {
            imageUrl: {
                type: String,
                default: ''
            }
        },
        methods: {
            beforeAvatarUpload(file) {
                this.$emit('upload', file);
                return false;
            }
        }
    }
</script>

<style lang="less">
    .avatar-uploader {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:hover {
                border-color: #409EFF;
            }
        }
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 140px;
        height: 140px;
        line-height: 140px;
        text-align: center;
    }
    .avatar {
        width: 140px;
        height: 140px;
        display: block;
    }
</style>
