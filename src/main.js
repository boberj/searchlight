// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
import App from './App'
import auth from '@/lib/auth'
import Database from '@/lib/database'
import spotify from '@/lib/spotify'
import { State } from '@/constants'
import Store from '@/store'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueMoment)

const db = Database.createDb()

var initialState = null
if (auth.loggedIn()) {
  spotify.init(auth.getSession().access_token)
  initialState = State.AUTHENTICATED
} else {
  console.log('Spotify: Not authenticated')
  initialState = State.UNAUTHENTICATED
}

const store = Store.createStore(initialState, db, spotify)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App },
  mounted: function () {
    this.$nextTick(function () {
      if (this.$store.state.state === State.AUTHENTICATED) {
        return this.$store.dispatch('sync')
      }
    })
  }
})
