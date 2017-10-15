<template>
  <div class="hello">
    <h1>Searchlight for Spotify</h1>
    <h2>Find your lost songs</h2>
    <p>Searchlight for Spotify shows you not only what songs you've saved but also <i>where</i> you saved them.</p>
    <p>Authenticate with Spotify to <a :href="authenticateUrl">begin</a>.</p>
  </div>
</template>

<script>
  import auth from '../lib/auth'

  export default {
    name: 'HelloWorld',
    data () {
      return {
        authenticateUrl: auth.authenticateUrl
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

a {
  color: #42b983;
}
</style>
