<template>
<div class="login-page">
  <div class="info info--error" v-if="infoError">{{ msg }}</div>
  <div class="form">
    <form class="register-form" v-on:submit.prevent="register">
      <input type="email" v-model.trim="email" placeholder="email"/>
      <input type="password" v-model.trim="password"  placeholder="password"/>
      <input type="password" v-model.trim="confirmation_password" placeholder="password confirmation"/>
      <button>create</button>
      <p class="message">Already registered? <router-link to="login">Sign In</router-link></p>
    </form>
  </div>
</div>
</template>

<script>
import router from '@/router'
import store from '@/store'

export default {
  name: 'Register',
  data () {
    return {
      infoError: false,
      msg: 'Login failed. Please try again.',
      email: '',
      password: '',
      confirmation_password: ''
    }
  },
  beforeCreate () {
    if (store.state.isLogged) {
      router.push('/')
    }
  },
  methods: {
    register () {
      this.infoError = false
      this.$http.post('http://localhost:3000/api/signup', {
        email: this.email,
        password: this.password,
        confirmation_password: this.confirmation_password
      }).then((res) => {
        if (!res.body.token) {
          this.infoError = true
          this.msg = res.body.err
          this.password = ''
          this.confirmation_password = ''
        }
        if (res.err) {
          this.infoError = true
          this.msg = res.body.err
          this.password = ''
          this.confirmation_password = ''
          router.push('register')
        }
        localStorage.setItem('token', res.body.token)
        localStorage.setItem('auth_id', res.body.user._id)
        store.commit('LOGIN_USER')
        store.commit('AUTH_ID', res.body.user._id)
        router.push('/')
      }, () => {
        this.infoError = true
        this.password = ''
      })
    }
  }
}
</script>

<style lang="">
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

.info{
  color: #fff;
  background: #ef3b3a;
  padding: 20px;
  font-size: 1.2rem;
}
.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}
.form {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #4CAF50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form button:hover,.form button:active,.form button:focus {
  background: #43A047;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #4CAF50;
  text-decoration: none;
}
</style>