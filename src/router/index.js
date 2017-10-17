import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'ndex',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'legister',
      component: Register
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    }
  ]
})
