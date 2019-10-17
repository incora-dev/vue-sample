<template>
  <router-view></router-view>
</template>

<script>
  import store from '../store'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        right: null,
        search: ''
      }
    }
  }
</script>

<style>
</style>
