<template>
  <div id="app">
    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" enable-background="new 0 0 26 26">
      <path style="text-indent:0;text-align:start;line-height:normal;text-transform:none;block-progression:tb;-inkscape-font-specification:Bitstream Vera Sans" d="M 24.90625 0 L 6.40625 9.90625 C 7.10625 10.20625 7.7125 10.6875 8.3125 11.1875 L 24.90625 0 z M 26 1 L 10.8125 14.5 C 11.2125 15.4 11.5 16.2875 11.5 17.1875 L 26 1 z M 4.6875 11 C 4.259375 10.978125 3.85 11.0875 3.5 11.3125 C 2.9 11.7125 1.3125 12.6875 0.8125 13.1875 C 0.10185489 13.819232 -0.050850725 14.834951 0.0625 15.75 C 0.18705289 16.75548 0.59446728 17.811096 1.28125 18.84375 C 1.9680327 19.876403 2.8083844 20.683854 3.6875 21.1875 C 4.5666156 21.691146 5.6522602 21.949119 6.5625 21.34375 C 6.67628 21.268079 6.7836897 21.183309 6.875 21.09375 C 7.2613973 20.861356 7.6245781 20.672784 8.0625 20.375 C 8.0112336 21.556565 7.7890902 22.565385 7.40625 23.1875 C 7.00625 23.7875 6.6875 24 6.1875 24 C 5.9875 24 5.49375 23.7875 5.09375 22.6875 C 4.49375 22.6875 3.7875 22.39375 3.1875 22.09375 C 3.39 22.8025 3.6600324 23.447444 3.96875 24 C 3.897899 24.035757 2 25.018382 2 26 L 11 26 C 11 25.018382 9.102101 24.035757 9.03125 24 C 9.5999184 22.672839 9.7497174 20.853053 9.625 19.03125 C 10.314436 17.841066 9.9918702 15.781282 8.6875 13.90625 C 7.4875 12.18125 5.971875 11.065625 4.6875 11 z M 2.125 14.65625 C 2.13487 14.64965 2.3803576 14.604964 2.90625 14.90625 C 3.4321424 15.207534 4.0879197 15.817441 4.625 16.625 C 5.1620803 17.43256 5.4567416 18.304765 5.53125 18.90625 C 5.605758 19.507734 5.478616 19.649689 5.46875 19.65625 C 5.45888 19.66285 5.2133925 19.770035 4.6875 19.46875 C 4.1616071 19.167466 3.5058303 18.52631 2.96875 17.71875 C 2.4316697 16.911191 2.1057584 16.101484 2.03125 15.5 C 1.956742 14.898516 2.115134 14.662812 2.125 14.65625 z" overflow="visible" enable-background="accumulate" font-family="Bitstream Vera Sans"/>
    </svg>
    <hello-world/>
    <spotify/>
    <div id="footer">
      Logo from <a href="https://icons8.com/">Icons8</a>.
    </div>
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
  margin-top: 60px;

  .logo {
    width: 200px;
    height: 200px;
    fill: currentColor;
  }
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

</style>
