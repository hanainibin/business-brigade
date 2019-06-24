import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import store from './store/store'
import router from './router/router'
import 'babel-polyfill';

Vue.use(ElementUI)

Vue.config.productionTip = false

window.globelEvent = new Vue()
setTimeout (() => {
  window.__sogou_secure_input = {}
  window.__sogou_secure_input.check = function() {}
}, 100)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')