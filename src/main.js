import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import store from './store'
import router from './router'


import './assets/tailwind.css';
import './assets/main.css'


createApp(App)
  .use(createPinia())
  .use(store)
  .use(router)
  .mount('#app')
