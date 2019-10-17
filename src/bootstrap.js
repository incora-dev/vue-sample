/* ============
 * Bootstrap File
 * ============
 *
 * Will configure and bootstrap the application.
 */

/* ============
 * Vue
 * ============
 *
 * Vue.js is a library for building interactive web interfaces.
 * It provides data-reactive components with a simple and flexible API.
 *
 * http://rc.vuejs.org/guide/
 */
import Vue from 'vue'
import store from './store'
let appConfiguration = require('../config/app')

Vue.config.debug = process.env.NODE_ENV !== 'production'

/* ============
 * VueI18n
 * ============
 */
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

/* ============
* VueKindergarten
* ============
*/
import VueKindergarten from 'vue-kindergarten';
// import Child from './perimeters/Child';
import {createSandbox} from 'vue-kindergarten';
// import RouteGoverness from './perimeters/RouteGoverness.js'

Vue.use(VueKindergarten,
  {child: (store) => Child(store)}
);

/* ============
 * Vuetify
 * ============
 */
import Vuetify from 'vuetify'

Vue.use(Vuetify)

/* ============
 * Vue-moment
 * ============
 */
Vue.use(require('vue-moment'))

/* ============
 * VeeValidate
 * ============
 */
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  errorBagName: 'veeErrors'
})
VeeValidate.Validator.extend('verify_password', {
  getMessage: field => `The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. !, @, #, $, %, ^, &, *, ?)`,
  validate: value => {
    // console.log("PWD value: ",value)
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*?])(?=.{8,})");
    return strongRegex.test(value);
  }
})
VeeValidate.Validator.extend('check_user_id', {
  getMessage: field => `The User Id must either be empty or 40-characters`,
  validate: value => {
    if (value.length == 0) {
      return true;
    }
    else {
      return (value.length == 40);
    }

  }
})


// console.log();
// Object.defineProperty(Vue.prototype, '$http', {

// }

/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */
import Axios from 'axios'
import JsonApi from 'devour-client';

const jsonApi = new JsonApi({
  apiUrl: process.env.API_LOCATION
});

Axios.defaults.baseURL = process.env.API_LOCATION
Axios.defaults.headers.common.Accept = 'application/vnd.api+json'
Axios.defaults.headers.common['Authorization'] = localStorage.getItem(appConfiguration.jwt)
Axios.interceptors.response.use(function (response) {
    if(response.headers.new_access_token !== localStorage.getItem(appConfiguration.jwt) && response.headers.new_access_token != null ){
      localStorage.setItem(appConfiguration.jwt, response.headers.new_access_token)
      store.dispatch('auth/getTokenData')
      Axios.defaults.headers.common['Authorization'] = localStorage.getItem(appConfiguration.jwt)
      jsonApi.headers['Authorization'] = localStorage.getItem(appConfiguration.jwt)
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch('auth/logout')
    }
    return Promise.reject(error)
  })

Vue.$http = Axios
Object.defineProperty(Vue.prototype, '$http', {
  get() {
    return Axios
  }
})


/* ============
 * Devour
 * ============
 *
 * JsonAPI client for Node
 *
 * https://github.com/twg/devour
 */
// import {} from './devour'

/* ============
 * Vuex Router Sync
 * ============
 *
 * Effortlessly keep vue-Router and vuex store in sync.
 *
 * https://github.com/vuejs/vuex-router-sync/blob/master/README.md
 */
import VuexRouterSync from 'vuex-router-sync'

/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

export const router = new VueRouter({
  base: appConfiguration.path,
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(localStorage.getItem(appConfiguration.jwt) == null|| localStorage.getItem(appConfiguration.jwt) === "undefined") {
    /*
    * If the user is not authenticated and visits
    * a page redirect to the login page
    */
    if (to.name === 'forbidden.index' || to.name === 'authorize.index') {
      next()
    }
    else {
      // WE ARE ALREADY IN LOGIN PAGE
      next({
        name: 'forbidden.index'
      });
    }
  }
  // else {
  //   store.dispatch('auth/startTokenWatchdog');
  //   to.matched.forEach((routeRecord) => {
  //     const perimeter = routeRecord.meta.perimeter;
  //     const Governess = routeRecord.meta.governess || RouteGoverness;
  //     const action = routeRecord.meta.perimeterAction || 'route';
  //     if (perimeter) {
  //       const sandbox = createSandbox(
  //         Child(store),
  //         {
  //           governess: new Governess({from, to, next}),
  //           perimeters: [
  //             perimeter,
  //           ],
  //         });
  //       return sandbox.guard(action, {next});
  //     }
  //     return next();
  //   });
  //   // if (to.matched.some(m => m.meta && m.meta.guest) && store.getters['auth/isLoggedIn']) {
  //   //     /*
  //   //      * If the user is authenticated and visits
  //   //      * a guest page, redirect to the dashboard page
  //   //      */
  //   //     next({
  //   //         name: 'entries.index'
  //   //     })
  //   // }
  //   // else {
  //   //     next();
  //   // }
  // }
  else{
    next();
  }
})
VuexRouterSync.sync(store, router);

Vue.router = router;

/* ============
 * jQuery
 * ============
 *
 * Require jQuery
 *
 * http://jquery.com/
 */
// import jQuery from 'jquery';

// window.$ = window.jQuery = jQuery;

/* ============
 * Font Awesome
 * ============
 *
 * Require font-awesome.
 *
 * http://http://fontawesome.io/
 */
// require('font-awesome/less/font-awesome.less');

/* ============
 * Styling
 * ============
 *
 * Require the application styling.
 * Stylus is used for this boilerplate.
 *
 * If you don't want to use Stylus, that's fine!
 * Replace the stylus directory with the CSS preprocessor you want.
 * Require the entry point here & install the webpack loader.
 *
 * It's that easy...
 *
 * http://stylus-lang.com/
 */
// require('./stylus/main.styl')

export default {
  router,
  store
}
