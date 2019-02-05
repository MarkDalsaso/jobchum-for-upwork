// NOTE: this is the entry point of the ext. popop ..AND!
//       therefor initiates the root "Vue" instance for the popup
// * This file, "popup/popup.js" is the webpack 'entry'
// * "popup/popup.html" is the default popup defined in the manifest

import * as utils from '../shared/utils.js'
import Vue from 'vue'
import App from './App'
import {store} from '../store/index.js'
import router from './router'

// NOTE: This (along w. v-if="stateIsReady" in App.vue),
//        eliminates ALL undefined state property errors
store.dispatch('initState')
   .then ( () => {
      utils.logMsg( "state initialized: " + store.state.initialized.toString())
   })
   .catch(err => { utils.logErr(err); });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  productionTip: false,
  render: h => h(App)
})
