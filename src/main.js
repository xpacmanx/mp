import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import './scss/_variables.scss'
import './assets/tailwind.css';
import './assets/main.css'


createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
