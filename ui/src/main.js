import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style/index.css'
import App from './App.vue'
import router from './router'
import './utils/permission' // permission control
import './hooks/useWindowSize';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'

const app = createApp(App).use(store)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(router).use(ElementPlus).mount('#app')
