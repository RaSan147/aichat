import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style'
import './js/rem'
import store from './store/index'

// var vueAdvancedChat = new VueAdvancedChat();
const app = createApp(App)
app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('vue-advanced-chat');
};

// 使用插件和挂载应用程序
app.use(router).use(Varlet).use(store).mount('#app');
