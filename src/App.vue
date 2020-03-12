import {remote} from "electron";
<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import { remote } from 'electron';

    export default {
        created() {
            const win = remote.getCurrentWindow();
            this.$store.commit('setWindow', win);
        }
    }
</script>

<style lang="less">
    @import "./assets/less/common";
</style>
