<template>
  <div id="app">
    <!--
    <img class="logo" src="./assets/logo.png">
    <hello></hello>
    <calendar></calendar>
    -->
    <spotify></spotify>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Calendar from './components/Calendar'
import Spotify from './components/Spotify'

export default {
  components: {
    Hello,
    Calendar,
    Spotify
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
