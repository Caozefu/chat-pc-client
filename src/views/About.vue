<template>
  <div class="about">
    <ul>
      <li v-for="(item, index) in messageList" :key="index">{{item}}</li>
    </ul>
    <input type="text" v-model="msg" />
    <button @click="send">发送</button>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  data() {
    return {
      IO: null,
      msg: "",
      messageList: []
    };
  },
  methods: {
    send() {
      this.IO.emit("chat message", this.msg);
      this.msg = "";
    }
  },
  created() {
    this.IO = io.connect('http://35.241.111.247:3000/');
    this.IO.on('chat message', (msg) => {
      this.messageList.push(msg);
    });
  }
};
</script>

<style>
</style>script
