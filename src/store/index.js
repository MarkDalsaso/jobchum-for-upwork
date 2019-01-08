import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

/* See 'misc_backup\store_original_folder' for details
export default new Vuex.Store({
  state: { foo: 'bar' },
  getters,
  mutations,
  actions
})
*/

export default new Vuex.Store({
   // The 'source of truth' that drives the app
   state: {
      topics: [],
      results: []
   },
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
      loadTopics (state, payload) {
         state.topics = payload;
         console.log({'loadTopics mutation has fired': state.topics})
      },
      loadResults (state, payload) {
         state.results = payload;
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
      loadTopics: ( { commit }, payload) => { 
           // Bulk storage set to persist updated individual, 'topic_' key/value objects
           chrome.storage.local.set( { "topics": payload } , function () {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }
            else {
               commit('loadTopics', payload )
            }
        });         
      },
      loadResults: ( { commit }, payload) => { 
         // Bulk storage set to persist updated individual, 'topic_' key/value objects
         chrome.storage.local.set( { "results": payload } , function () {
          if (chrome.runtime.lastError) {
              console.log(chrome.runtime.lastError.message);
          }
          else {
             commit('loadResults', payload )
          }
      });         
    }
   }
})

/* NOTE: see: C:\Users\MarkD\Desktop\0 Training And Learning\1 - Modern JS Development\Vue.js\Udemy\Vue JS 2 The Complete Guide\3AxiosModuleProject
         'store.js' module for great examples on commiting and
         dispatching and proper handling of asynchronous storage calls
*/