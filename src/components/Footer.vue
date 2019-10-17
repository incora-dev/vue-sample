<template>
<footer v-if="!($route.name == 'clio.index' || $route.name == 'clioentries.index' || $route.name == 'authorize.index' || $route.name == 'clioexportentries.index' || $route.name == 'clioimportmetadata.index')">

  <v-card class="white elevation-1" light fixed>
    <v-card-text class="custom-footer pa-2">
      <v-layout wrap>
        <v-flex xs12 class="text-xs-center">
          <a class="px-3" href="#" target="_blank">Terms of Service</a>
          <a class="px-3" href="#" target="_blank">Privacy Policy</a>
        </v-flex>
        <v-flex xs12 class="text-xs-center">
        <span class="caption copyright">
          All Rights Reserved.
        </span>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>

     <v-dialog v-model="dialog" persistent fullscreen transition="v-dialog-bottom-transition" :overlay=true>
      <v-card>
        <v-card-row>
          <v-card-title>Terms Of Service</v-card-title>
        </v-card-row>
        <v-card-row height='auto'>
          <iframe width="95%" height='500px' src="./static/TOS/index.html"></iframe>
        </v-card-row>

      </v-card>
    </v-dialog>
</footer>
</template>

<script>
 import { mapGetters } from 'vuex'


 export default {
 data() {
    return {
      dialog: false,
    }
  },
}
</script>

<style>
  .custom-footer a{
    text-decoration: none;
  }
  .custom-footer a:hover{
    text-decoration: underline;
  }
.copyright {
  color: rgba(0,0,0,0.87);
}

</style>
