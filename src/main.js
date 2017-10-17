// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueAlert from '@vuejs-pt/vue-alert'
import VueSocketio from 'vue-socket.io'
import App from './App'
import router from './router'
import store from './store/index'

Vue.use(VueResource)
Vue.use(VueAlert)
Vue.config.productionTip = false
Vue.use(VueSocketio, 'http://localhost:3333', store)

/* Filters */
Vue.filter('truncate', function (value, length) {
  if (value.length < length) {
    return value
  }
  length = length - 3
  return value.substring(0, length) + '...'
})

Vue.filter('uppercase', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toUpperCase()
})

/* eslint-disable no-new */
new Vue({
  sockets: {
    connect: () => {
      console.log('socket connected')
    }
  },
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
