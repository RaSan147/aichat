import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import {VueAdvancedChat} from 'vue-advanced-chat'
import './js/rem'
import store from './store/index'

var vueAdvancedChat = new VueAdvancedChat();
createApp(App).use(store).use(router).use(Varlet).use(vueAdvancedChat).use(store).mount('#app')
