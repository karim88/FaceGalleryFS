<template></template>

<script>
  import router from '@/router'
  import store from '@/store'
  export default {
    name: 'Logout',
    mounted () {
      localStorage.removeItem('token')
      localStorage.removeItem('auth_id')
      store.commit('LOGOUT_USER')
      store.commit('AUTH_ID', 0)
      router.push('login')
    }
  }
</script>