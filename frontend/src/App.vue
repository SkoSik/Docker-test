<template>
  <div id="app">
    <navbar/>
    <br />
    <div class="container-md mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
    import Navbar from './components/Navbar'

    export default {
        name: 'App',
        components: {
            Navbar: Navbar
        }
    }
</script>

<style>
  body {
    margin: 20px;
  }
</style>