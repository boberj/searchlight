// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
import App from './App'
import Auth from '@/lib/auth'
import Database from '@/lib/database'
import spotify from '@/lib/spotify'
import { State } from '@/constants'
import Store from '@/store'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueMoment)

const db = Database.createDb()

const session = Auth.getSession(window.location.hash).getOrElse(null)

// Remove hash in location bar, if any
history.replaceState(null, '', window.location.pathname)

if (session) {
  spotify.init(session.accessToken)
  Auth.saveSession(session)
}

const initialState = session ? State.AUTHENTICATED : State.UNAUTHENTICATED

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
