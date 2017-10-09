<template>
  <div id="spotify">
    <div>
      <button v-on:click="load">Authenticate</button>
      <button v-on:click="init">Init client</button>
      <button v-on:click="me">Me info</button>
      <button v-on:click="getPlaylists">Fetch & store playlists</button>
      <button v-on:click="loadPlaylists">Load playlists</button>
      <button v-on:click="update">Clear playlists</button>
      <button v-on:click="test">Test</button>
    </div>
    <div>{{ tracks.total }} songs, {{ tracks.duration | readableDuration }}</div>
    <div v-if="progress.loading">Loading playlist {{ progress.playlist.current }} / {{ progress.playlist.total }}</div>
    <div v-if="progress.indexing">Indexing...</div>
    <div id="search">
      <input id="search-input" type="text" v-model="search.filter" debounce="250"/>
      <div>
        <input type="checkbox" id="tracks" v-model="search.tracks"><label for="tracks">Tracks</label>
        <input type="checkbox" id="artists" v-model="search.artists"><label for="artists">Artists</label>
      </div>
      <div>{{ search.results }} results ({{ search.duration }} ms)</div>
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
          <tr v-for="item in list">
            <td>{{ item.track.name }}</td>
            <td>{{ item.track.artists | mkArtistString }}</td>
            <td>{{ item.track.album.name }}</td>
            <td>{{ item.playlist.name }}</td>
            <td :title="item.added_at | moment('calendar')">{{ item.added_at | moment('from', 'now') }}</td>
          </tr>
          <tr v-if="search.results > search.displayMax"><td colspan="5">And {{ search.results - search.displayMax }} more results</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>

#spotify {

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
import spotify from '../lib/spotify'
import Lockr from 'lockr'

function log (response) {
  console.log(response)
}

export default {
  name: 'Spotify',
  methods: {
    test: function () {
      auth.test()
    },
    load: function (event) {
      console.log(auth.authenticate())
    },
    init: function () {
      spotify.init(auth.getSession().access_token)
    },
    me: function (event) {
      spotify.me(this).then(log)
    },
    getPlaylists: function (event) {
      var self = this
      var p = []
      var progress = this.progress
      this.tracks.total = 0
      this.tracks.duration = 0

      spotify.playlists(this).then(function (playlists) {
        progress.playlist.current = 0
        progress.playlist.total = playlists.length
        progress.loading = true

        return playlists.reduce(function (sequence, playlist) {
          return sequence
            .then(_ => { progress.playlist.current += 1 })
            .then(_ => spotify.tracks(playlist.owner.id, playlist.id))
            .then(tracks => {
              var duration = 0
              let addedTracks = 0
              tracks.forEach(track => {
                if (track.track === null) {
                  return
                }

                duration += Math.floor(track.track.duration_ms / 1000)
                track['playlist'] = playlist
                p.push(track)
                addedTracks++
              })
              self.tracks.total += addedTracks
              self.tracks.duration += duration
            })
        }, Promise.resolve())
      }).then(_ => {
        progress.loading = false
        progress.indexing = true
        // To avoid UI hanging on indexing
        setTimeout(_ => {
          self.tracks.items = p
          progress.indexing = false
          Lockr.set('playlists', self.tracks)
        }, 0)
      })
    },
    loadPlaylists: function () {
      this.tracks = Lockr.get('playlists')
    },
    update: function (event) {
      this.tracks.items = []
      this.tracks.total = 0
      this.tracks.duration = 0
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
    }
  },
  computed: {
    filterLower: function () {
      return this.search.filter.toLowerCase()
    },
    list: function () {
      var self = this
      var start = window.performance.now()
      var list = this.tracks.items.filter(item => {
        return self.search.filter.length === 0 ||
          (self.search.tracks && item.track.name.toLowerCase().includes(self.filterLower)) ||
          (self.search.artists && item.track.artists.some(artist => artist.name.toLowerCase().includes(self.filterLower)))
      })
      this.search.duration = Math.round(window.performance.now() - start)
      this.search.results = list.length

      var collator = new Intl.Collator()

      return list
        .slice(0, this.search.displayMax)
        .sort((a, b) => {
          var c

          c = collator.compare(a.track.name, b.track.name)
          if (c !== 0) return c

          c = collator.compare(a.track.artists.map(artist => artist.name), b.track.artists.map(artist => artist.name))
          if (c !== 0) return c

          c = collator.compare(a.track.album.name, b.track.album.name)
          if (c !== 0) return c

          c = collator.compare(a.playlist.name, b.playlist.name)
          if (c !== 0) return c

          return collator.compare(a.added_at, b.added_at)
        })
    }
  },
  data () {
    return {
      search: {
        filter: '',
        tracks: true,
        artists: false,
        duration: 0,
        results: 0,
        displayMax: 50
      },
      progress: {
        loading: false,
        indexing: false,
        playlist: {
          current: 0,
          total: 0
        }
      },
      tracks: {
        total: 0,
        duration: 0,
        items: [{
          playlist: {
            name: 'pop'
          },
          track: {
            name: 'a a',
            artists: [{
              name: 'Artist a1'
            }, {
              name: 'Artist a2'
            }],
            album: {
              name: 'Album a'
            }
          }
        }, {
          playlist: {
            name: 'pop'
          },
          track: {
            name: 'c c',
            artists: [{
              name: 'Artist c1'
            }, {
              name: 'Artist c2'
            }],
            album: {
              name: 'Album c'
            }
          }
        }, {
          playlist: {
            name: 'pop'
          },
          track: {
            name: 'b b',
            artists: [{
              name: 'Artist b1'
            }, {
              name: 'Artist b2'
            }],
            album: {
              name: 'Album b'
            }
          }
        }, {
          playlist: {
            name: 'pop'
          },
          track: {
            name: 'd d',
            artists: [{
              name: 'Artist d1'
            }, {
              name: 'Artist d2'
            }],
            album: {
              name: 'Album d'
            }
          }
        }]
      }
    }
  }
}
</script>
