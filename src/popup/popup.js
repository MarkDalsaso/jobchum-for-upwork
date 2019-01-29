// NOTE: this is the entry point of the ext. popop ..AND!
//       therefor initiates the root "Vue" instance for the popup
// * This file, "popup/popup.js" is the webpack 'entry'
// * "popup/popup.html" is the default popup defined in the manifest

import Vue from 'vue'
import App from './App'
import store from '../store/index.js'
import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
