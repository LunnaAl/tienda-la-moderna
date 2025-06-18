// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Tu CSS global, **tras** Bootstrap para que pueda sobrescribir variables
import '@/assets/global.css'
import '@/assets/responsive.css'
import '@/assets/theme.css' 
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App)
  .use(router)
  .mount('#app')
