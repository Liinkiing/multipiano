import Vue from 'vue'
import Popover  from 'vue-js-popover'
import App from './App.vue'
import router from './router'
import store from './store/'
import './assets/scss/app.scss'

Vue.config.productionTip = false

Vue.use(Popover)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
