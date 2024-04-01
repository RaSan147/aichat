import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import AdvancedChat from 'vue-advanced-chat'
createApp(App).use(store).use(router).use(Varlet).use(AdvancedChat).mount('#app')
