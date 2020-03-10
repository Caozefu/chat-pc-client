import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import axios from './http/axios'
import { initNotice } from "./utils/notice";

Vue.use(Vant);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

initNotice();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
