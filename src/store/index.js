import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLogged: !!localStorage.getItem('token') && localStorage.getItem('token') !== '',
  auth_id: localStorage.getItem('auth_id')
}

const mutations = {
  LOGIN_USER (state) {
    state.isLogged = true
  },
  LOGOUT_USER (state) {
    state.isLogged = false
  },
  AUTH_ID (state, id) {
    state.auth_id = id
  }
}

export default new Vuex.Store({
  strict: false,
  state,
  mutations
})
