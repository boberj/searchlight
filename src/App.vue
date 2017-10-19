<template>
  <div id="app">
    <img src="./assets/logo.png">
    <hello-world/>
    <spotify/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import Spotify from '@/components/Spotify.vue'

// TODO: Compatibility check
// window.indexedDB
// Chrome 57+ and Opera 17+; IE10+, FF 16+

export default {
  name: 'app',
  components: {
    Spotify,
    HelloWorld
  }
}
</script>

<style lang="scss">

@import url(https://fonts.googleapis.com/css?family=Montserrat);

body {
  background-color: #121314;
  color: #fff;
  font-family: Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#app {
  margin-top: 60px;
}

a {
  color: #1db954;
}
</style>
