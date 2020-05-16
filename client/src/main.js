import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import SocketIO from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import EvaIcons from 'vue-eva-icons'
import VueJsDialog from 'vuejs-dialog'
import VueTippy, { TippyComponent } from 'vue-tippy'

Vue.use(VueSocketIOExt, SocketIO(process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '/'));
Vue.use(EvaIcons);
Vue.use(VueJsDialog);
Vue.use(VueTippy, {
  directive: 'tippy',
  arrow: true
});

Vue.component('tippy', TippyComponent);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
