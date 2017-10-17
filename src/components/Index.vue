<template>
  <div class="main">
    <nav>
      <li v-show="!user.facebook"><a target="_blank" href="http://localhost:3000/auth/facebook"><i class="fa fa-facebook"></i><span class="desktop"> Link Facebook</span></a></li>
      <li class="me">{{ photos.length }} Hi {{ user_name | uppercase }}</li>
      <li><router-link to="logout"><i class="fa fa-sign-out"></i><span class="desktop"> Logout</span></router-link></li>
    </nav>
    <vue-alert></vue-alert>
    <div class="container" v-show="display">
      <div v-show="isEmpty(albums) && user.facebook" class="unlinked">
        <h1>You don't have any albums :)</h1>
        <p>why??</p>
      </div>
      <div v-show="!user.facebook" class="unlinked">
        <h1>Unlinked Account :(</h1>
        <p>Please link you facebook account to get your albums <a target="_blank" href="http://localhost:3000/auth/facebook"> Link it now.</a></p>
      </div>
      <div class="section group" v-show="!isEmpty(albums)">
        <div class="col span_4">
          <ul>
            <li v-bind:class="{ active: isActive == album.id }" v-for="album in albums"><a v-on:click="getAlbum(album.id)">{{ album.name | uppercase }}</a></li>
          </ul>
        </div>
        <div class="col span_2">
          <h2 class="text-white" v-show="current_album == 0">Choose a album to view their photos!</h2>
          <div class="card" v-for="photo in photos[current_album]">
            <a :href="photo.link">
              <div class="card-image">
                <img target="_blank" :src="photo.images[0].source" alt="Orange" />
              </div>  
              <div class="card-body">
                <div class="card-title">
                  <h3 :title="photo.name || '^_^'">{{ photo.name || '^_^' | truncate(20) }}</h3>
                </div>
                <div class="card-excerpt">
                  <p><a class="btn" :href="photo.images[0].source" download><i class="fa fa-download"></i> Download</a></p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import store from '@/store'

export default {
  name: 'Index',
  data () {
    return {
      display: false,
      user: {},
      user_name: '',
      albums: '',
      photos: {},
      current_album: 0,
      auth_id: store.state.auth_id,
      isLogged: store.state.isLogged,
      isActive: 0
    }
  },
  sockets: {
    fb_auth_response (val) {
      if (val.err) {
        this.dangerAlert('Account not linked!: ' + val.err)
      } else {
        if (val.user._id !== this.user._id) {
          console.log(val)
          this.dangerAlert('This facebook account is linked to a other account.')
        } else {
          this.user = val.user
          this.loadData()
          console.log(val)
          this.successAlert('Facebook account linked successfly!')
        }
      }
    }
  },
  beforeCreate () {
    if (!store.state.isLogged) {
      router.push('login')
    }
    this.auth_id = store.state.auth_id
    this.isLogged = store.state.isLogged
  },
  mounted () {
    if (this.isLogged && this.auth_id) {
      this.loadData()
    }
  },
  methods: {
    loadData () {
      this.$http.get('http://localhost:3000/api/user/' + this.auth_id)
      .then((res) => {
        this.user = res.body.user
        this.user_name = (this.user.firstname && this.user.lastname) ? this.user.firstname + ' ' + this.user.lastname : this.user.email

        // get Albums by user
        this.$http.get('http://localhost:3000/api/albums/' + this.auth_id)
        .then((d) => {
          this.albums = d.body.data
          this.display = true
        }, (err) => {
          console.log(err)
        })
      }, (err) => {
        console.log(err)
      })
    },
    isEmpty (obj) {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false
        }
      }
      return true
    },
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
    getAlbum (id) {
      this.isActive = id
      this.$http.get('http://localhost:3000/api/album/' + this.auth_id + '/' + id)
      .then((d) => {
        this.current_album = id
        this.photos[id] = d.body.data
        console.log(this.photos)
      }, (err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Playfair+Display");
@import url("https://fonts.googleapis.com/css?family=Playfair+Display|Source+Sans+Pro");

.main{
  margin-top: 100px;
  height: 100%;
}
.unlinked{
  color: #fff;
}
.unlinked a {
  color: #fff;
}
.text-white {
  color: #fff;
}
.main nav{
  background-color: #fff;
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  z-index: 500;
  text-align: right;
}
.main nav li{
  display: inline-block;
  color: #4CAC55;
  padding: 20px;
}
.main nav li:hover:not(.me){
  background-color: #EEE;
}
.main nav li a{
  color: #4CAF50;
  text-decoration: none;
  padding: 21px;
}
.container{
  margin-top: 50px !important;
}

/** Grid **/
/*  SECTIONS  */
.section {
	clear: both;
	padding: 0px;
	margin: 0px;
}

/*  COLUMN SETUP  */
.col {
	display: block;
	float:left;
	margin: 1% 0 1% 1.6%;
}
.col:first-child { margin-left: 0; }

/*  GROUPING  */
.group:before,
.group:after { content:""; display:table; }
.group:after { clear:both;}
.group {
  min-height: 60vh;
  width: 100vw;
  zoom:1; /* For IE 6/7 */
}

.span_1 {
	width: 100%;
}
.span_2 {
	width: 74.6%;
}
.span_3 {
	width: 49.2%;
}
.span_4 {
	width: 23.8%;
}

.span_4 ul {
  position: fixed;
  background-color: #fff;
  padding: 0;
  margin-left: 25px;
  border: 2px solid #EEE;
  box-shadow: 0 0 2px #EEE;
  border-radius: 3px;
}

.span_4 ul li {
  list-style: none;
  text-align: left;
  padding: 10px 20px;
  color: #4CAC55;
}
.span_4 ul li a{
  display: block;
  cursor: pointer;
}
.span_4 ul li:hover {
  background-color: #EEE;
  color: #2A9B55;
}
/** Card **/
.card {
  display: inline-block;
  width: 300px;
  margin: 15px;
  background-color: white;
  box-shadow: 0px 5px 20px #555;
}
.card a {
  color: #333;
  text-decoration: none;
}
.card:hover .card-image img {
  width: 110%;
  filter: grayscale(0);
}

.active {
  background-color: #EEE;
}

.card-image {
  height: 250px;
  position: relative;
  overflow: hidden;
}
.card-image img {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: grayscale(1);
  transition-property: filter width;
  transition-duration: .3s;
}

.card-body {
  text-align: center;
  padding: 15px 20px;
  box-sizing: border-box;
}

.card-title, .card-exceprt {
  font-family: 'Playfair Display', serif;
}

.card-title {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
}

.btn {
  background-color: #4CAF50;
  padding: 15px;
  border-radius: 3px;
  color: #fff !important;
}
.btn:hover {
  background-color: #2BAC55;
}


/** Collapsable **/
@charset "UTF-8";
.collapse > input[type="checkbox"] {
  display: none;
}
.collapse > input[type="checkbox"]:checked ~ label::after {
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.collapse > input[type="checkbox"]:checked ~ .collapse__content {
  display: block;
}
.collapse > label {
  display: block;
  padding: 8px;
  cursor: pointer;
  color: #4CAC55;
  background-color: #fff;
  box-shadow: 0 2px 2px #4CAC55;
  border-bottom: 1px solid #4CAC55; 
}
.collapse > label::after {
  content: '▾';
  display: inline-block;
  margin-left: 4px;
}
.collapse__content {
  padding: 8px;
  display: none;
  background-color: #eee;
}

@media (max-width: 600px) {
  .collapse--collapse-on-sm > label {
    display: none;
  }
  .collapse--collapse-on-sm .collapse__content {
    display: block;
  }
  .desktop{
    display: none;
  }
  .span_4 ul {
    position: relative;
    text-align: center;
  }
  .card {
    width: 100%;
    margin: 20px 0;
  }
  .col {  margin: 1% 0 1% 0%; }
	.span_1, .span_2, .span_3, .span_4 {
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
  }
  .span_4 ul {
    margin-left: 0;
  }
  .col:first-child { margin-left: 10% !important; }

}
</style>