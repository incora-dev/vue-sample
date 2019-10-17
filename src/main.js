// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueFuse from 'vue-fuse'

Vue.use(VueFuse)
Vue.use(Vuex)

import store from './store'
import { router } from './bootstrap'
import {i18n} from './i18n'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
window.App = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
