import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import router from './router'
// 引入全局样式文件
import './assets/styles/global.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 自定义 Element Plus 语言配置，修改分页里的 "Go to" 和 "10/page" 文案
const customLocale = {
  ...zhCn,
  el: {
    ...(zhCn.el || {}),
    pagination: {
      ...(zhCn.el?.pagination || {}),
      // 改成 "至"
      goto: '至',
      // pageSize 下拉里的后缀，从 "条/页" 改成 "/页"，例如 "10/页"
      pagesize: '/页'
    }
  }
}

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { locale: customLocale })
app.use(VueKonva)
app.use(router)
app.mount('#app')