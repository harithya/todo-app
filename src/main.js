import { createApp } from 'vue'
import '@stisla/css'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import './style.css'
import '@stisla/vanilla'
import App from './App.vue'
import router from './router'
import './theme'

createApp(App).use(router).mount('#app')
