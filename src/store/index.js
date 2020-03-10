import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    isLogin: false,
    friendList: [],
    msgNum: 0
  },
  mutations: {
    login( state, data ) {
      state.isLogin = true;
      state.userInfo = data
    },
    logout( state ) {
      state.isLogin = false;
      state.userInfo = null;
    },
    updateFriendList( state, data ) {
      state.friendList = data;
    },
    requestNum(state, data) {
      state.msgNum = data;
    }
  },
  actions: {

  }
})
