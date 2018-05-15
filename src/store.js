import Copy from '@/utils/adt/copy'
import Freeze from '@/utils/adt/freeze'
import Playlist from '@/repositories/playlist'
import Playlists from '@/services/playlists'
import * as R from 'ramda'
import Search from '@/services/search'
import * as Union from 'folktale/adt/union/union'
import Vuex from 'vuex'

export const State = Union('State', {
  Authenticated () {},
  Indexing (progress) {
    return { progress }
  },
  Ready (tracks, index) {
    return { tracks, index }
  },
  Syncing (progress) {
    return { progress }
  },
  Unauthenticated () {}
}).derive(Copy, Freeze)

const createUnauthenticatedStore = () => new Vuex.Store({
  state: {
    state: State.Unauthenticated().freeze()
  }
})

const createAuthenticatedStore = (db, spotify) => new Vuex.Store({
  state: {
    state: State.Authenticated().freeze()
  },
  mutations: {
    syncing (state) {
      state.state = State.Syncing(0).freeze()
    },
    indexing (state) {
      state.state = State.Indexing(0).freeze()
    },
    ready (state, { tracks, index }) {
      state.state = State.Ready(tracks, index).freeze()
    },
    progress (state, progress) {
      state.state = state.state.copy({ progress }).freeze()
    }
  },
  actions: {
    async sync ({ commit, dispatch }) {
      commit('syncing')
      await Playlists.syncPlaylists(db, spotify, (progress) => { commit('progress', progress) })
      commit('indexing')
      const result = await dispatch('loadPlaylists')
      commit('ready', result)
    },
    async loadPlaylists ({ commit, dispatch }) {
      const playlists = await Playlist.findAll(db)
      const tracks = await dispatch('transformPlaylists', playlists)
      const index = await Search.createIndex(tracks, (progress) => { commit('progress', progress) })
      return {
        tracks,
        index
      }
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
