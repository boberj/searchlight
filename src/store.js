import Vuex from 'vuex'
import Playlist from '@/repositories/playlist'
import Playlists from '@/services/playlists'
import * as R from 'ramda'
import Search from '@/services/search'
import { State } from '@/constants'

const createUnauthenticatedStore = () => new Vuex.Store({
  state: {
    state: State.UNAUTHENTICATED
  }
})

const createAuthenticatedStore = (db, spotify) => new Vuex.Store({
  state: {
    progress: 0,
    state: State.AUTHENTICATED,
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
    async sync ({ commit, dispatch }) {
      commit('syncing')
      await Playlists.syncPlaylists(db, spotify, (progress) => { commit('progress', progress) })
      commit('indexing')
      await dispatch('loadPlaylists')
      commit('ready')
    },
    async loadPlaylists ({ commit, dispatch }) {
      const playlists = await Playlist.findAll(db)
      const tracks = await dispatch('transformPlaylists', playlists)
      commit('tracks', Object.freeze(tracks))
      commit('progress', 0)
      const index = await Search.createIndex(tracks, (progress) => { commit('progress', progress) })
      commit('index', Object.freeze(index))
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
  createAuthenticatedStore,
  createUnauthenticatedStore
}
