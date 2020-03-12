import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import axios from './http/axios'
import iview from 'view-design'
// import { initNotice } from "./utils/notice";
import 'element-ui/lib/theme-chalk/index.css'
import 'view-design/dist/styles/iview.css'

Vue.use(Element);
Vue.use(iview);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

// initNotice();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
