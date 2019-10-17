<template>
  <div>
    <v-navigation-drawer temporary v-model="drawer" dark>
      <v-list>
        <v-list-tile style="cursor: default">
          <v-list-tile-action>
            <img :src="logo" style="height: 24px;" alt="">
          </v-list-tile-action>
          <v-list-tile-content>Clio Bar</v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile
          v-for="item in menuItems"
          v-if="item.show"
          :key="item.title"
          :router="true"
          @click.native="openClioURL(item.path)">
          <v-list-tile-action>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <!--<v-list-tile>-->
          <!--<v-list-tile-action>-->
            <!--<v-icon class="white&#45;&#45;text">apps</v-icon>-->
          <!--</v-list-tile-action>-->
          <!--<v-list-tile-content>{{ appName }}</v-list-tile-content>-->
        <!--</v-list-tile>-->
      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="!($route.name == 'clio.index' || $route.name == 'clioentries.index' || $route.name == 'clioexportentries.index' || $route.name == 'clioimportmetadata.index')" class="elevation-2 px-2 justify-content-center" style="background: #3A3D3F; height: 32px;" fixed>
      <img :src="logo" class="clio-bar__logo" alt="">
      <span class="white--text clio-bar-item__logo">Clio Integration Bar</span>
      <v-toolbar-items v-if="isAuthenticated" class="hidden-sm-and-down">
        <span
          class="white--text clio-bar-item"
          v-for="item in menuItems"
          v-if="item.show"
          @click="openClioURL(item.path)"
          >
          <!--<v-icon>{{ item.icon }}</v-icon>-->
          <span class="clio-bar-item__text">{{ item.title }}</span>
        </span>
        <span
          class="white dark--text clio-bar-item"
        >
          <!--<v-icon>{{ item.icon }}</v-icon>-->
          <span class="clio-bar-item__text">{{ appName }}</span>
        </span>
      </v-toolbar-items>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <v-btn icon small flat v-if="isAuthenticated" class="hidden-md-and-up white--text my-1" light @click.native.stop="drawer = !drawer">
        <v-icon>subject</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import store from '../store';
// import AllPerimeters from '../perimeters/AllPerimeters.js'
const app = require('../../config/app.js');

export default {
  computed: {
    ...mapGetters('auth', ['tokenData', 'isAuthenticated']),
    profileLinkLabel() {
      return this.isAdmin() ? 'Settings' : 'Profile'
    },
    appName(){
      return app.name;
    },
    menuItems () {
        return [
          { title: 'Dashboard', show: true, path: 'https://app.clio.com/nc/#/', icon: 'home' },
          { title: 'Calendar', show: true, path: 'https://app.clio.com/nc/#/calendars', icon: 'date_range' },
          { title: 'Tasks', show: true, path: 'https://app.clio.com/nc/#/tasks', icon: 'list' },
          { title: 'Matters', show: true, path: 'https://app.clio.com/nc/#/matters', icon: 'work' },
          { title: 'Contacts', show: true, path: 'https://app.clio.com/nc/#/contacts', icon: 'contacts' },
          { title: 'Activities', show: true, path: 'https://app.clio.com/nc/#/activities', icon: 'access_time' },
          { title: 'Bills', show: true, path: 'https://app.clio.com/nc/#/bills', icon: 'monetization_on' },
          { title: 'Accounts', show: true, path: 'https://app.clio.com/nc/#/bank_accounts', icon: 'account_balance  ' },
          { title: 'Documents', show: true, path: 'https://app.clio.com/nc/#/documents', icon: 'folder' },
          { title: 'Communications', show: true, path: 'https://app.clio.com/nc/#/communications', icon: 'phone' },
          { title: 'Reports', show: true, path: 'https://app.clio.com/nc/#/reports', icon: 'equalizer' },
        ]
    },
  },
  methods: {
    openClioURL(url){
      window.open(
        url,
        '_blank'
      );
    },
    logout() {
      this.$store.dispatch('auth/logout');
    },
    setLogo(){
      this.logo = './static/clio-logo.svg'
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
      window.location = 'https://staging-login.effortlesslegal.com/admin/dashboard'
    }
  },
  mounted() {
    // console.log(this);
    // console.log(AllPerimeters);
    this.setLogo()
  },
  data() {
    return {
      drawer: false,
      title: 'BillerAssist',
      logo: '',
    }
  },
//  perimeters: [
//    AllPerimeters.accountsPerimeter,
//    AllPerimeters.clientsPerimeter,
//    AllPerimeters.entriesPerimeter,
//    AllPerimeters.mattersPerimeter,
//    AllPerimeters.usersPerimeter
//  ]
}
</script>

<style>
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

.clio-bar-item {
  padding: 0px 8px;
  cursor: pointer;
  height: 32px;
  line-height: 32px
}
.clio-bar-item__text{
  font-size: 11px;
}
  .clio-bar__logo{
    height: 32px;
    width: 20px;
    padding: 6px 0;
  }
  .clio-bar-item__logo{
    font-size: 14px;
    padding: 0px 9px;
    cursor: pointer;
    height: 32px;
    line-height: 32px
  }
@media only screen and (min-width: 1024px) {
  .clio-bar__logo{
    margin-left: 0px !important;
  }
}

</style>
