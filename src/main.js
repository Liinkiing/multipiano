import Vue from 'vue'
import ToggleButton from 'vue-js-toggle-button'
import VueSocketio from 'vue-socket.io';
import DateFilter from 'vue-date-filter'
import VModal from 'vue-js-modal'
import App from './App.vue'
import router from './router'
import store from './store/'
import './assets/scss/app.scss'


Vue.config.productionTip = false

export const EventBus = new Vue()

Vue.use(VModal)
Vue.use(DateFilter)
Vue.use(ToggleButton)
Vue.use(VueSocketio, process.env.VUE_APP_SOCKET_URL, store);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
