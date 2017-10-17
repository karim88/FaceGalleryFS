<template>
<div class="login-page">
<vue-alert></vue-alert>
  <div class="info info--error" v-if="infoError">{{ msg }}</div>
  <div class="form">
    <div class="login-form">
      <input type="email" name="email" v-model.trim="email" placeholder="username"/>
      <input type="password" name="password" v-model.trim="password" placeholder="password"/>
      <button class="btn" v-on:click.prevent="login">login</button>
      <p class="message">Not registered? <router-link to="register">Create an account</router-link></p>
    </div>
  </div>
</div>
</template>

<script>
import router from '@/router'
import store from '@/store'

export default {
  name: 'Register',
  sockets: {
    fb_auth_response (val) {
      if (val.err) {
        this.dangerAlert('Account not linked!: ' + val.err)
      } else {
        this.user = val.user
        console.log(val)
        localStorage.setItem('token', val.token)
        localStorage.setItem('auth_id', val.user._id)
        store.commit('LOGIN_USER')
        router.push('/')
      }
    }
  },
  data () {
    return {
      infoError: false,
      email: '',
      password: '',
      msg: 'Login failed. Please try again.'
    }
  },
  beforeCreate () {
    if (store.state.isLogged) {
      router.push('/')
    }
  },
  methods: {
    dangerAlert (msg) {
      this.$alert.danger({
        message: msg
      })
    },
    successAlert (msg) {
      this.$alert.success({
        message: msg
      })
    },
    login () {
      const url = 'http://localhost:3000/api/login'
      this.infoError = false
      this.$http.post(url, {
        email: this.email,
        password: this.password
      }).then((res) => {
        if (!res.body.token || res.body.err) {
          this.infoError = true
          console.log(res.body.err)
          if (res.body.err.length > 0) this.msg = res.body.err[0].msg
          if (typeof res.body.err === 'string') this.msg = res.body.err
          this.password = ''
        } else {
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('auth_id', res.body.user._id)
          store.commit('LOGIN_USER')
          store.commit('AUTH_ID', res.body.user._id)
          router.push('/')
        }
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
.btn {
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