import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { plugin as VueTippy, Tippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
import { socketPlugin } from './plugins/socket'
import { dialogPlugin } from './plugins/dialog'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueTippy, { directive: 'tippy', defaultProps: { arrow: true } })
app.component('tippy', Tippy)
app.use(socketPlugin)
app.use(dialogPlugin)

app.mount('#app')
