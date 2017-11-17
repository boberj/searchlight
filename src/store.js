import Vuex from 'vuex'
import Playlist from '@/repositories/playlist'
import Playlists from '@/services/playlists'
import * as R from 'ramda'
import Search from '@/services/search'
import { State } from '@/constants'

const createStore = (initialState, db, spotify) => new Vuex.Store({
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
      return Playlists.syncPlaylists(
        db, spotify, (progress) => { commit('progress', progress) }
      ).then(() => {
        commit('indexing')
        return dispatch('loadPlaylists')
      }).then(() => {
        commit('ready')
      })
    },
    loadPlaylists ({ commit, dispatch }) {
      return Playlist.findAll(db)
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

export default {
  createStore
}
