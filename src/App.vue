<template>
  <div id="app">
    <transition name="view" mode="out-in">
      <component v-bind:is="currentView"></component>
    </transition>
    <div id="footer">
      Logo from <a href="https://icons8.com/">Icons8</a>.
    </div>
  </div>
</template>

<script>
import LandingPage from '@/components/LandingPage.vue'
import Spotify from '@/components/Spotify.vue'
import { State } from '@/constants'

// TODO: Compatibility check
// window.indexedDB
// Chrome 57+ and Opera 17+; IE10+, FF 16+

export default {
  name: 'app',
  components: {
    Spotify,
    LandingPage
  },
  computed: {
    currentView: function () {
      return this.$store.state.state === State.READY ? Spotify : LandingPage
    }
  }
}
</script>

<style lang="scss">

@import url(https://fonts.googleapis.com/css?family=Montserrat);

html {
  height: 100%;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  position: relative;
  margin: 0;
  padding-bottom: 3rem;
  min-height: 100%;

  background-color: #121314;
  color: #fff;

  font-family: Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#app {

}

#footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
}

a {
  color: #1db954;
}

.view-enter-active, .view-leave-active {
  transition: opacity .5s
}
.view-enter, .view-leave-to {
  opacity: 0
}

</style>
