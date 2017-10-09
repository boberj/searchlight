<template>
  <div class="hello">
    <h1>Welcome to Searchlight for Spotify</h1>
    <h2>Find your lost songs</h2>
    <p>Searchlight for Spotify shows you not only what songs you've saved but also <i>where</i> you saved them.</p>
    <p>Authenticate with Spotify to <a href="https://accounts.spotify.com/authorize?client_id=8ff22b4d074b418b9a20d935f59e0373&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&scope=playlist-read-private%20playlist-read-collaborative%20user-library-read&response_type=token">begin</a>.</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
