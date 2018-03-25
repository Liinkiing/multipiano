import Vue from 'vue'
import ToggleButton from 'vue-js-toggle-button'
import VModal from 'vue-js-modal'
import App from './App.vue'
import router from './router'
import store from './store/'
import './assets/scss/app.scss'

Vue.config.productionTip = false

Vue.use(VModal)
Vue.use(ToggleButton)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
