// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
import App from './App'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueMoment)

const store = new Vuex.Store({
  state: {
    progress: {
      percent: 0,
      state: 'asdf'
    }
  },
  mutations: {
    syncing (state) {
      state.progress.state = 'syncing'
    },
    indexing (state) {
      state.progress.state = 'indexing'
    },
    ready (state) {
      state.progress.state = 'ready'
    },
    progress (state, percent) {
      state.progress.percent = percent
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: { App }
})
