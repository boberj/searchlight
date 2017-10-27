<template>
  <div class="hello">
    <h1>Searchlight for Spotify</h1>
    <h2>Find your lost songs</h2>
    <p>Searchlight for Spotify shows you not only what songs you've saved but also <i>where</i> you saved them.</p>
    <p>Authenticate with Spotify to <a :href="authenticateUrl">begin</a>.</p>

    <div v-if="progress.state === 'syncing'">Loading your playlists {{ progress.percent | inPercent }}</div>
    <div v-if="progress.state === 'indexing'">Indexing (this might take a while)</div>
    <div v-if="progress.state === 'ready'">Your tracks are waiting to be rediscovered</div>
  </div>
</template>

<script>
  import auth from '../lib/auth'
  import { mapState } from 'vuex'

  export default {
    name: 'LandingPage',
    data () {
      return {
        authenticateUrl: auth.authenticateUrl
      }
    },
    computed: {
      ...mapState([
        'progress'
      ])
    },
    filters: {
      inPercent: function (percent) {
        return `${Math.round(percent * 100)}%`
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
</style>
