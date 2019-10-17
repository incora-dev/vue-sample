<template>
  <v-app class="fill-height">
    <clio-bar v-if="clioBar"></clio-bar>
    <topmenu></topmenu>
    <main :class="clioBar ? 'main-app-top-padding-with-clio' : 'main-app-top-padding'">
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
        <v-snackbar :success="context === 'success'" :info="context === 'info'" :warning="context === 'warning'" :error="context === 'error'" :primary="context === 'primary'" :secondary="context === 'secondary'" :timeout="timeout" :top="y === 'top'" :bottom="y === 'bottom'" :right="x === 'right'" :left="x === 'left'" :multi-line="mode === 'multi-line'" :vertical="mode === 'vertical'" v-model="snackbar">
          {{ text }}
          <v-btn flat class="white--text" @click.native="closeMessage()">Close</v-btn>
        </v-snackbar>
      </v-container>
      <!-- <p v-if="isLoggedIn && profile" class="text-xs-right mr-4">Welcome {{ this.profile.fullname }} - You are logged on with the role of "{{this.profile.role_human}}"</p> -->
    <eflFooter></eflFooter>
    </main>

  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TopMenu from './components/TopMenu'
import ClioBar from './components/ClioBar'
import Footer from './components/Footer'
import store from './store'
export default {
  components: {
    'topmenu': TopMenu,
    'clio-bar': ClioBar,
    'eflFooter': Footer
  },
  methods: {
    closeMessage() {
      this.$store.dispatch('snackbar/closeMessage');
    }
  },

  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [],
      miniVariant: false,
      right: false,
      rightDrawer: false,
    }
  }
}
</script>

<style lang="stylus">
  @import './stylus/main'
.container {
  padding-top:10px;
}
  .container--fluid {
  /*max-width: 1024px;*/
}
  .main-app-top-padding{
    padding-top: 56px
  }
  .main-app-top-padding-with-clio{
    padding-top: 88px
  }

</style>
