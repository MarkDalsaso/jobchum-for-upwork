import Vue from 'vue';
import Vuex from 'vuex';
import * as utils from '../shared/utils.js'
Vue.use(Vuex);

const rootContainerName = 'jmStore';
const jmInitialState = {
   'topics': [],
   'results': [],
   'settings': {} 
};

export default new Vuex.Store({
   // The 'source of truth' that drives the app
   state: jmInitialState,
   getters: {
      // 'getters' get something from state (and optionally tweak it ),
      // and return it. It's a disciplied alternative to directly
      // accesseing the 'state' (to faciltate DRY)
      allTopics: state => state.topics,
      allResults: state => state.results
   },
   mutations: {
      /* purpose
      Used to change state immediately (synchronously) via a commit.
      A commit is typically called via a mutation, so that changes 
      relying on asynchronous call (xhr, db, chrome.store) are properly
      abstracted ensuring that the actual change in state can be 
      tracked.
      */
      loadTopics(state, payload) {
         state.topics = payload;
         utils.logMsg({ 'loadTopics mutation has fired': state.topics })
      },
      loadResults(state, payload) {
         state.results = payload;
      },
      initFromLocalStore(state, payload) {
      }
   },
   actions: {
      /* purpose
      Allows asynchronous tasks to safely commit (via mutations), The 
      best-practise is to 'dispatch' action, instead of committing
      mutations directly
      */

      /* syntax(s)
      verbose syntax using 'commit'
      loadTopics: commit => { commit.commit('loadTopics'); }
      concise syntax (use destructuring to extract only the 'commit' method)
      */

     initBrowserStorage: ({ commit }) => {
         let p1 = browser.storage.local.get(rootContainerName);
         p1.then(results => {
            // if no 'own' prop's in 'jmStore' assume it's empty and initialize.
            if ( (Object.keys(results)).length === 0 ) {
               let p2 = browser.storage.local.set( {[rootContainerName]: jmInitialState} );
               p2.then( () => {
                  utils.logMsg({ 'Browser storage initialized': jmInitialState });
               })
            }
          })
         .catch(utils.logErr);
      },
      // processTopics: ({ commit }, payload) => {
      //    browser.storage.local.set({ topics: payload })
      //       .then( () => {
      //          commit('loadTopics', payload);  //resolve
      //       })
      //       .catch(logErr);
      // },
      processTopics: ({ commit }, payload) => {
         // unimplemented
      },
      processResults: ({ commit }, payload) => {
         // unimplemented
      }
   }
});

/* NOTE: see: C:\Users\MarkD\Desktop\0 Training And Learning\1 - Modern JS Development\Vue.js\Udemy\Vue JS 2 The Complete Guide\3AxiosModuleProject
         'store.js' module for great examples on commiting and
         dispatching and proper handling of asynchronous storage calls
*/
