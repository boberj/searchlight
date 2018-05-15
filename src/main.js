// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
import App from './App'
import Auth from '@/lib/auth'
import Database from '@/lib/database'
import Spotify from '@/lib/spotify'
import Store, { State } from '@/store'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueMoment)

const hash = window.location.hash

// Remove hash in location bar, if any
history.replaceState(null, '', window.location.pathname)

const createApp = (store) => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    template: '<App/>',
    components: { App },
    mounted: function () {
      this.$nextTick(function () {
        if (State.Authenticated.hasInstance(this.$store.state.state)) {
          return this.$store.dispatch('sync')
        }
      })
    }
  })
}

const onUnauthenticated = async () => {
  const store = Store.createUnauthenticatedStore()

  createApp(store)
}

const onAuthenticated = async (session) => {
  Auth.saveSession(session)
  const db = Database.createDb()
  const spotify = await Spotify.createClient(session.accessToken)
  const store = Store.createAuthenticatedStore(db, spotify)

  createApp(store)
}

Auth.getSession(hash).fold(onUnauthenticated, onAuthenticated)
