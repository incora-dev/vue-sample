/* ============
 * Auth Module
 * ============
 */

import Vue from 'vue';
import Vuex from 'vuex';
// import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
const appConfiguration = require('../../../../config/app.js');

const state = {
  token: localStorage.getItem('jwt'),
  accessToken: localStorage.getItem(appConfiguration.jwt),
  tokenWatchdogInterval: null,
  tokenInfo: null,
  appId: null,
  profile: null,
  loading: false,
  redirecting: false,
  invalidHashMessage: false,
}


const getters = {

  tokenInfo: state => state.tokenInfo,
  invalidHashMessage: state => state.invalidHashMessage,
  redirecting: state => state.redirecting,
  tokenData(state) {
    return getTokenData() ;
  },
  profile: state => profileTransformer.fetch(state.profile), //state.profile,
  isAuthenticated(state) {
    if (state.accessToken === "undefined" || !state.accessToken) {
      return false;
    }
    else {
      return true;
    }
  },
  loading: state => state.loading,
}

const mutations = {
  setToken(state, token) {
    state.token = token
    localStorage.setItem('jwt', token)
    const bearerAuth = `Bearer ${token}`
    Vue.$http.defaults.headers.common.Authorization = bearerAuth
    Vue.$jsonApi.headers.Authorization = bearerAuth
  },
  setAccessToken(state, token) {
    state.acesstoken = token
    localStorage.setItem(appConfiguration.jwt, token)
  },
  setTokenWatchdogInterval(state, interval) {
    if (state.tokenWatchdogInterval) {
      clearInterval(state.tokenWatchdogInterval);
    }
    state.tokenWatchdogInterval = interval;
  },
  setTokenInfo(state, tokenInfo) {
    state.tokenInfo = tokenInfo;
  },
  setAppId(state, appId) {
    state.appId = appId;
  },
  setProfile(state, payload) {
    // Vue.set(state, 'profile', payload);
    if (!state.profile) {
      state.profile = {};
    }

    _.each(Object.keys(payload), (key, idx, value) => {
      state.profile[key] = payload[key];
    });


  },
  resetToken(state) {
    clearInterval(state.tokenWatchdogInterval);
    localStorage.clear();
    Vue.$http.defaults.headers.common.Authorization = '';
    Vue.$jsonApi.headers.Authorization = '';
    _.each(Object.keys(state), (key, idx, value) => {
      state[key] = null;
    });
  },
  startLoading(state) {
    state.loading = true
  },
  stopLoading(state) {
    state.loading = false
  },
  startRedirecting(state) {
    state.redirecting = true
  },
  stopRedirecting(state) {
    state.redirecting = false
  },
  invalidHashMessage(state) {
    state.invalidHashMessage = true
  },
}

const actions = {
  // async login({dispatch, commit}, user) {
  //   const endpoint = process.env.API_LOCATION + '/user_token';
  //   const res = await Vue.$http.post(endpoint, {auth: user});
  //   commit('setToken', res.data.jwt);
  //   dispatch('loadProfile');
  //
  //   // SETTING TokenWatchdog
  //   dispatch('startTokenWatchdog');
  //   // Vue.router.push({
  //   //   name: 'entries.index'
  //   // });
  // },
  async authorize({dispatch, commit}, payload) {
    commit('startLoading')
    const url = '/integration_auth';
    Vue.$http.post(url, payload)
      .then((response) => {
        if (response.data.access_token !== undefined) {
          commit('stopLoading')
          commit('startRedirecting')
          commit('setAccessToken', response.data.access_token)
          dispatch('getTokenData')
          dispatch('getTokenInfo')
          setTimeout(() => {
            commit('stopRedirecting')
            //Vue.router.go({name: 'authorize.index'})
            window.location = window.location.pathname
          }, 3000);
        }
        else {
          commit('stopLoading')
          commit('invalidHashMessage')
        }
      })
      .catch(e => {
        commit('stopLoading')
        console.log('ERROR: ', e)
      })
    ;
  },

  getTokenData(){
    const token = localStorage.getItem(appConfiguration.jwt);
    if(token){
      const payload = getPayload({token: token});
      return payload;
    }
    else{

    }
  },

  getTokenInfo({state, dispatch, commit}) {
    let tokenInfo = null;
    const token = state.token;
    if (token != null) {
      let payload = getPayload({
        token: token
      });
      tokenInfo = payload;
    }
    commit('setTokenInfo', tokenInfo);
  },

  startTokenWatchdog({dispatch, commit}) {
    dispatch('checkToken');
    const interval = setInterval(function () {
      dispatch('checkToken');
    }, process.env.TOKENWATCHDOG_INTERVAL);
    commit('setTokenWatchdogInterval', interval);
  },


  checkToken({dispatch, commit, state}) {
    // console.log('Checking Token...');
    const isValid = isTokenValid();
    if (isValid) {
      const token = localStorage.getItem('jwt');
      commit('setToken', token);
    }
    else {
      dispatch('logout');
    }
  },

  logout({dispatch, commit, rootState}) {
    commit('resetToken');
    Vue.router.push({name: 'login.index'})
    // _.each(Object.keys(rootState), (key, idx, value) => {
    //   try {
    //     if (key != "auth" && key != "route") {
    //       console.log("Clearing store: " + key);
    //       commit(`${key}/clearStore`, null, { root: true });
    //     }
    //   }
    //   catch (error) {
    //     console.log("Clear failed: " + error);
    //   }
    // });
  },

  // load the user profile from API
  async loadProfile({state, commit, dispatch}) {
    commit('startLoading');
    getTokenData();

    if (state.userId) {
      // console.log('retrieving profile...');
      try {
        const data = await Vue.$jsonApi.one('user', state.userId).get();
        commit('setProfile', data);
      }
      catch (e) {
        dispatch('logout');
        console.log(e);
      }
    }
    commit('stopLoading');
  },

  async update({rootState, state, dispatch, commit}, item) {
    try {
      await Vue.$jsonApi.update('user', item);
      commit('setProfile', item);
    }
    catch (e) {
      console.log('profile update failed: ', e);
      throw (e);
    }
  },
  async updatePassword({rootState, state, dispatch}, payload) {
    try {
      await Vue.$jsonApi.update('user', payload);
    }
    catch (e) {
      console.log('password update failed: ', e);
      throw (e);
    }
  }
}

const getPayload = ({token}) => {
  const payload = token.split('.')[1];
  const res = (payload) ? JSON.parse(atob(payload)) : "";
  return res;
}

const getTokenData= () => {
  const token = localStorage.getItem(appConfiguration.jwt);
  if(token){
    const payload = getPayload({token: token});
    return payload;
  }
  else{

  }
}

const isTokenValid = () => {
  let isValid = false;
  const token = localStorage.getItem('jwt');
  if (token) {
    const payload = getPayload({token: token});

    // NOW
    //const now = moment().add(12, 'hours');
    const now = moment();


    // REMOTE EXPIRATION TIME
    const remoteExpirationTime = moment(payload.exp * 1000);
    let localExpirationTime = null;

    // EXPIRATION TIME
    let expirationTime = remoteExpirationTime;

    // LOCAL EXPIRATION TIME
    if ((process.env.LOCAL_TOKEN_EXPIRATION_ANTICIPATION) && (parseInt(process.env.LOCAL_TOKEN_EXPIRATION_ANTICIPATION) > 0)) {
      const delta_t = moment.duration(parseInt(process.env.LOCAL_TOKEN_EXPIRATION_ANTICIPATION), 'hours');
      localExpirationTime = moment(payload.exp * 1000).subtract(delta_t);
      expirationTime = moment.min(localExpirationTime, remoteExpirationTime);
    }

    // MINUTES TO EXPIRATION TIME
    const diff = expirationTime.diff(now, 'minutes');

    isValid = diff > 0;

    const duration = moment.duration(diff, 'minutes');
    const expiresIn = duration.hours() + "h " + duration.minutes() + "m";
    // console.log('JWT expires in: ', expiresIn);

  }
  return isValid
}

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
