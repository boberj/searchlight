<template>
  <div class="hello">
    <h1>Searchlight for Spotify</h1>
    <h2>Find your lost songs</h2>
    <p>Searchlight for Spotify shows you not only what songs you've saved but also <i>where</i> you saved them.</p>
    <p>
      <span v-if="state === State.UNAUTHENTICATED">Authenticate with Spotify to <a :href="authenticateUrl">begin.</a></span>
      <span v-if="state === State.SYNCING">Loading your playlists {{ progress | inPercent }}</span>
      <span v-if="state === State.INDEXING">Indexing (this might take a while)</span>
      <span v-if="state === State.READY">Your tracks are waiting to be rediscovered!</span>
    </p>
  </div>
</template>

<script>
  import auth from '../lib/auth'
  import { mapState } from 'vuex'
  import { State } from '@/constants'

  export default {
    name: 'LandingPage',
    data () {
      return {
        authenticateUrl: auth.authenticateUrl
      }
    },
    created () {
      this.State = State
    },
    computed: {
      ...mapState([
        'progress',
        'state'
      ])
    },
    filters: {
      inPercent: function (progress) {
        return `${Math.round(progress * 100)}%`
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
