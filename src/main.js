// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueMoment from 'vue-moment'
import App from './App'
import auth from '@/lib/auth'
import Database from '@/services/database'
import Playlist from '@/services/playlists'
import * as R from 'ramda'
import Search from '@/services/search'
import spotify from '@/lib/spotify'
import { State } from '@/constants'

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

const store = new Vuex.Store({
  state: {
    progress: 0,
    state: initialState,
    tracks: [],
    index: null
  },
  mutations: {
    syncing (state) {
      state.state = State.SYNCING
    },
    indexing (state) {
      state.state = State.INDEXING
    },
    ready (state) {
      state.state = State.READY
    },
    progress (state, progress) {
      state.progress = progress
    },
    tracks (state, tracks) {
      state.tracks = tracks
    },
    index (state, index) {
      state.index = index
    }
  },
  actions: {
    sync ({ commit, dispatch }) {
      commit('syncing')
      return Playlist.syncPlaylists(
        db, spotify, (progress) => { commit('progress', progress) }
      ).then(() => {
        commit('indexing')
        return dispatch('loadPlaylists')
      }).then(() => {
        commit('ready')
      })
    },
    loadPlaylists ({ commit, dispatch }) {
      return Database.getPlaylists(db)
        .then((playlists) => {
          return dispatch('transformPlaylists', playlists)
        }).then((tracks) => {
          commit('tracks', Object.freeze(tracks))
          commit('progress', 0)
          return Search.createIndex(tracks, (progress) => { commit('progress', progress) })
        }).then((index) => {
          commit('index', Object.freeze(index))
        })
    },
    /**
     * Tranforms
     *
     * From (document)                 To (table)
     *
     * [{                              [{
     *   id                              playlist {
     *   name                              name
     *   snapshot_id                     }
     *   owner {                         track {
     *     id                              album {
     *   }                                   name
     *   tracks [{                         }
     *     added_at                        artists [{
     *     track {                           name
     *       album {                       }]
     *         name                        duration_ms
     *       }                             name
     *       artists [{                  }
     *         name                      added_at
     *       }]                        }]
     *       duration_ms
     *       name
     *     }
     *   }]
     * }]
     */
    transformPlaylists (context, playlists) {
      return R.chain(
        playlist => R.map(
          R.assoc('playlist', { name: playlist.name }),
          R.filter(track => track.track !== null, playlist.tracks)
        ),
        playlists
      )
    }
  }
})

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
