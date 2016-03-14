import Vue from 'vue'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'

import App from './App'
import auth from './lib/auth'

Vue.use(VueResource)
Vue.use(VueMoment)

/* eslint-disable no-new */
if (auth.loggedIn()) {
  new Vue({
    el: 'body',
    components: { App }
  })
} else {
  auth.authenticate()
}
