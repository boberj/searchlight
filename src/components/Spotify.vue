<template>
  <div id="spotify">
    <div>
      <button v-on:click='sync'>Sync playlists</button>
      <button v-on:click="loadPlaylists">Load playlists from DB</button>
    </div>
    <div v-if="progress.state === 'syncing'">Loading your playlists {{ progress.percent | inPercent }}</div>
    <div v-if="progress.state === 'indexing'">Indexing (this might take a while)</div>
    <div v-if="progress.state === 'ready'">Your {{ tracks.length }} tracks are ready to be searched</div>
    <div id="search">
      <input id="search-input" type="text" v-model="search.filter" debounce="250"/>
      <div>{{ search.results.length }} results</div>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Playlist</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in search.results">
            <td>{{ result.track.name }}</td>
            <td>{{ result.track.artists | mkArtistString }}</td>
            <td>{{ result.track.album.name }}</td>
            <td>{{ result.playlist.name }}</td>
            <td :title="result.added_at | inCalendarTime">{{ result.added_at | inRelativeTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="footer">
      Favicon from <a href="https://icons8.com/">Icons8</a>.
    </div>
  </div>
</template>

<style lang="scss" scoped>

#spotify {
  a {
    color: #42b983;
  }

  div {
    display: block;
  }

  table {
    table-layout: fixed;
    width: 100%;
  }

  th {
    font-size: .8rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-align: left;
    text-transform: uppercase;
  }

  td {
    font-size: 1.2em;
    height: 40px;
    line-height: 19px;
    border-top: 1px solid #222326;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  #search {
    margin: 10px;
    text-align: center;

    #search-input {
      width: 200px;
      font-family: Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 14px;
    }
  }

}

</style>

<script>
import auth from '../lib/auth'
import Database from '@/services/database'
import debounce from 'debounce'
import moment from 'moment'
import Playlist from '@/services/playlists'
import * as R from 'ramda'
import Search from '@/services/search'
import spotify from '../lib/spotify'

if (auth.loggedIn()) {
  spotify.init(auth.getSession().access_token)
} else {
  console.log('Spotify: Not authenticated')
}

// TODO: Inject
const db = Database.createDb()

export default {
  name: 'Spotify',
  methods: {
    sync: function () {
      const self = this
      this.progress.state = 'syncing'
      return Playlist.syncPlaylists(db, spotify, (progress) => {
        self.progress.percent = progress
      })
        .then(() => {
          self.progress.state = 'indexing'
          return this.loadPlaylists()
        })
        .then(() => {
          self.progress.state = 'ready'
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
    transformPlaylists: function (playlists) {
      return R.chain(
        playlist => R.map(
          R.assoc('playlist', { name: playlist.name }),
          R.filter(track => track.track !== null, playlist.tracks)
        ),
        playlists
      )
    },
    loadPlaylists: function () {
      return Database.getPlaylists(db).then((playlists) => {
        const data = this.transformPlaylists(playlists)
        this.tracks = data
        this.index = Search.createIndex(data)
      })
    },
    runSearch: debounce(function () {
      this.search.results = Search.find(this.index, this.query).map((i) => this.tracks[i])
    }, 200)
  },
  watch: {
    query: function () {
      if (this.index && this.query.length > 0) {
        this.runSearch()
      } else {
        this.search.results = []
      }
    }
  },
  filters: {
    mkArtistString: function (artists) {
      if (!artists) return
      return artists.map(artist => artist.name).join(', ')
    },
    readableDuration: function (duration) {
      duration = Math.floor(duration / 60) // In minutes
      var minutes = duration % 60
      duration = Math.floor(duration / 60) // In hours
      var hours = duration % 24
      var days = Math.floor(duration / 24)  // In days

      if (days > 0) return `${days} days ${hours} hrs ${minutes} mins`
      if (hours > 0) return `${hours} hrs ${minutes} mins`
      if (minutes > 0) return `${minutes} mins`
      return '0 mins'
    },
    inPercent: function (percent) {
      return `${Math.round(percent * 100)}%`
    },
    inRelativeTime: function (instant) {
      const date = moment(instant)
      return date.isValid() ? date.fromNow() : ''
    },
    inCalendarTime: function (instant) {
      const date = moment(instant)
      return date.isValid() ? date.calendar() : ''
    }
  },
  computed: {

  },
  data () {
    return {
      query: '',
      search: {
        results: []
      },
      progress: {
        syncing: false,
        indexing: false,
        percent: 0,
        state: ''
      },
      tracks: []
    }
  }
}
</script>
