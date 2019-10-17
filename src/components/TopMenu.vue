<template>
  <div>
    <v-navigation-drawer temporary v-model="drawer" light>
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          v-if="item.show"
          :key="item.title"
          :router="true"
          :href="{ name: item.path }">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="!($route.name == 'clio.index' || $route.name == 'clioentries.index' || $route.name == 'clioexportentries.index' || $route.name == 'clioimportmetadata.index')" :class="clioBar ? 'white elevation-2 toolbar-top-with-clio' : 'white elevation-2'" light fixed>
        <v-toolbar-logo>
          <a class="flexbox" href="./">
            <img v-bind:src="logo" height="50px">
          </a>
        </v-toolbar-logo>

        <v-toolbar-items v-if="isAuthenticated" class="hidden-sm-and-down">
          <v-btn
            flat
            v-for="item in menuItems"
            v-if="item.show"
            :router="true"
            :href="{ name: item.path }"
          >
            <!--<v-icon>{{ item.icon }}</v-icon>-->
            {{ item.title }}
          </v-btn>
          <v-menu offset-y left>
            <v-btn icon slot="activator" dark>
              <v-icon>apps</v-icon>
            </v-btn>
            
          </v-menu>
        </v-toolbar-items>
        <v-btn icon large flat v-if="isAuthenticated" class="hidden-md-and-up black--text" light @click.native.stop="drawer = !drawer">
          <v-icon>menu</v-icon>
        </v-btn>
      <!--</div>-->
    </v-toolbar> -->
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import store from '../store';
const app = require('../../config/app.js');
const config = require('../../config');

export default {
  computed: {
    ...mapGetters('auth', ['tokenData', 'isAuthenticated']),
    ...mapGetters('clio', ['clioBar']),
    profileLinkLabel() {
      return this.isAdmin() ? 'Settings' : 'Profile'
    },
    menuItems () {
        return [
          { title: 'Logs', show: true, path: 'logs.index', icon: 'view_list' },
          { title: 'About', show: true, path: 'About.index', icon: 'view_list' },
        ]
    },
  },
  methods: {

    setLogo(){
      this.logo = './static/' + app.logo
    },
    isAdmin(){
      if(this.tokenData !== undefined){
        if(this.tokenData.in_app_role_name === 'Admin'){
          return true
        }
        else return false
      }
      else{

      }
    },
    goToDashboard(){
      window.location = config.build.env.CAP_URL.replace(/"/gi, "")
    }
  },
  mounted() {
    this.setLogo()
  },
  data() {
    return {
      drawer: false,
      title: 'BillerAssist',
      logo: '',
    }
  },
}
</script>

<style>
  .container--toolbar{
    max-width: 1024px;
    display: flex;
  }
.toolbar {
  align-items: initial;
}

.toolbar__logo{
  margin-top: 0px;
}

.toolbar__items>.btn:hover, .toolbar__items>.btn--active {
  color: #1976D2;
}

.toolbar--light .toolbar__item {
 color: #fff;
 background: rgba(0,0,0,0.4);
}
.toolbar__items>.btn, .toolbar__items>.menu .menu__activator .btn {
  height: 100%;
  margin: 0;
}

.toolbar-top-with-clio {
  top: 32px;
}
</style>
