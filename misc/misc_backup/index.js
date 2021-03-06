import Vue from 'vue';
import Vuex from 'vuex';
import * as utils from '../shared/utils.js';
import sysSettings from '../shared/settings.json';
import notificationIcon from '../shared/notificationIcon';
import notificationMp3 from '../shared/notificationMp3';
Vue.use(Vuex);

const initialState = (function () {
   return {
      settings: sysSettings,
      topics: [],
      notificationLog: [],

      // ALL Items below are NOT persisted to storage
      current: {
         topics: {
            filter:  {
               name: '',
               count: 0
            }
         }
      },
      initialized: false   // Used to delay DOM render until state is ready
   }
})()

export const store = new Vuex.Store({
   state: initialState,
   getters: {
      topics: state => state.topics,
      settings: state => state.settings,
      current: state => state.current,
      initialized: state => state.initialized,
      topicById: state => id => {
         return state.topics.find(topic => topic.id === id);
      },
      topicsByFilterName: state => (filterName = 'all') => {
         // Topic filters driven by route param 'filter': On, Off, "All" (default )
         let rtnAry = []
         switch (filterName.toLowerCase()) {
            case 'all':
               rtnAry = state.topics;
               break;                    
            case 'on':
               rtnAry = state.topics.filter(topic => {
                  return topic.custom.enabled;
               });
               break;
            case 'off':
               rtnAry = state.topics.filter(topic => {
                  return !topic.custom.enabled;
               });
               break;
         }
         //return rtnAry;
         return {
            topics: rtnAry, 
            state: {
               name: filterName.charAt(0).toUpperCase() + filterName.slice(1),
               count: rtnAry.length
            }
         }
      }
   },
   mutations: {
      topics (state, payload) {
         state.topics = payload;
      },
      settings (state, payload) {
         state.settings = payload;
      },
      topicsFilterState (state, payload) {
         state.current.topics = payload;
      },
      initialized (state, payload) {
         state.initialized = payload;
      }       
   },
   actions: {
      updateTopics: ({ dispatch, getters, commit }, payload) => {
         dispatch('fetchFromStorage', 'topics')
            .then(() => {
               return processTopics(payload, getters.topics);
            })
            .then(updatedTopicsAry => {
               commit('topics', updatedTopicsAry);
               dispatch('persistToStorage', 'topics')
               .then(() => { 
                  /*utils.logMsg( updatedTopicsAry.length + " 'topics' persisted."); */
               });
            })
            .catch(err => { utils.logErr(err); });
      },
      updateTopicResults: ({ dispatch, getters }, payload) => {
         if ('topicId' in payload && typeof payload.topicId != 'undefined') {
            dispatch('fetchFromStorage', 'topics')
               .then(() => {
                  let topicId = Number(payload.topicId);
                  if (topicId == NaN) {
                     utils.logErr("Non-numeric topic id's are not supported.");
                  } else {
                     let topic = getters.topicById(topicId);
                     topic.custom.qLastRequest = Date.now();
                     if (topic.custom.enabled) {
                        // process topic if it's enabled
                        let newResults = newTopicResults( payload.results, topic );
                        if (newResults.length > 0) {
                           topic.results = topic.results.concat(newResults);
                           doTopicsResultsNotification(topic, newResults);
                        }
                     }
                     // Always persist (because qLastResult date needs to be updated)
                     dispatch('persistToStorage', 'topics')
                        .then(() => {
                           //utils.logMsg("'topics' (TopicResults) mutated and persisted")
                           browser.runtime.sendMessage({ 'store-update': 'topics' })
                           .then(() => {})
                           .catch(err => {
                              //NOTE: here is where: "Could not establish connection. Receiving end does not exist." is captured
                              //utils.logErr(err);
                           });
                        })
                        .catch(err => { utils.logErr(err); });
                  }
               })
               .catch(err => { utils.logErr(err); });
         }
      },
      fetchFromStorage({ commit }, rootKeyName) {
         return new Promise(function(resolve) {
            browser.storage.local.get(rootKeyName)
            .then(obj => {
               if (typeof obj[rootKeyName] !== 'undefined') {
                  //utils.logMsg( {fetchFromStorage: { [rootKeyName]: obj[rootKeyName]} });
                  commit(rootKeyName, obj[rootKeyName]); // refresh store
               }
               resolve();
            })
            .catch(err => { utils.logErr(err); });
         });
      },
      persistToStorage: ({ getters }, rootKeyName) => {
         return new Promise(function(resolve) {
            // NOTE: 'payload' is string, representing the root key name,
            //       'settings' or 'topics'
            const objToPersist = getters[rootKeyName];
            //utils.logMsg(utils.storeInfo('before persist', rootKeyName, objToPersist));
            browser.storage.local.set({ [rootKeyName]: objToPersist })
            .then(() => {
               //utils.logMsg(utils.storeInfo('after persist', rootKeyName, objToPersist));
               resolve();
            })
            .catch(err => { utils.logErr(err); });
         });
      },
      initState({state, commit}) {
         return new Promise(function (resolve) {
            browser.storage.local.get(null)
            .then(rootObj => {
               if (Object.keys(rootObj).length > 0) {
                  // Update Vuex store.state with data from local storage
                  for (let rootProp in rootObj) {
                     commit(rootProp, rootObj[rootProp])
                  }
               } else {
                  // Update local storage from Vuex store (just settings)
                  browser.storage.local.set({ 'settings': state.settings })
                  .catch(err => { utils.logErr(err); });
               }
               commit('initialized', true);
               resolve();
            })
            .catch(err => { utils.logErr(err); });            
         })
      },
      wipeExtensionState({ commit }) {
         browser.storage.local.clear().then(() => {
            commit('settings', {});
            commit('topics', []);
         })
         .catch(err => { utils.logErr(err); });
      },
      updateTopicsFilterState( {commit}, payload ) {
         commit('topicsFilterState', {filter: payload})
      }
   }
});

// Process the captured xhrResults array.
function newTopicResults(xhrResults, currentTopic) {
   // Check for lost state (may need to always call Ext storage)
   let newResults = [];
   for (let i = 0, len = xhrResults.length; i < len; i++) {
      let daysOldIgnore = currentTopic.custom.daysOldIgnore;
      let xhrResult = xhrResults[i];
      if (!resultTooOld(daysOldIgnore, xhrResult.publishedOn)) {
         if (!currentTopic.results.find(r => r.recno === xhrResult.recno)) {
            newResults.push(xhrResult);
         }
      }
   }
   return newResults;
}

function resultTooOld(days, jsonDate) {
   let rtn = false;
   try {
      let curDate = new Date();
      let date = new Date(jsonDate);
      let datePlusDays = date.setDate(date.getDate() + days);
      if (curDate > datePlusDays) {
         rtn = true;
      }
   } catch (err) {
      utils.logErr(err);
   }
   return rtn;
}

// Process the captured xhrTopics array and return updated topics array.
function processTopics(xhrTopics, currentTopics) {
   let rtnAry = [], xhrTopic = {}, curTopic = {};
   injectUpworkStandardTopics(xhrTopics)
   for (let i = 0, len = xhrTopics.length; i < len; i++) {
      xhrTopic = xhrTopics[i];
      curTopic = currentTopics.find(t => t.id === xhrTopic.id);
      if (curTopic) {
         // Add new topic, preserve existing 'custom' and 'results' props from 'curTopic'
         rtnAry.push(
            new Topic(xhrTopic.id, xhrTopic, curTopic.custom, curTopic.results)
         );
      } else {
         // Add new Topic
         rtnAry.push(new Topic(xhrTopic.id, xhrTopic));
      }
   }
   return rtnAry;
}

// Check settings and determine if Upwork standard topics should be injected
function injectUpworkStandardTopics (xhrTopics) {
   let userSettings = store.state.settings.ui.user
   if (userSettings.myFeedTopic) {
      xhrTopics.unshift( {id: 'myfeed', name: 'My Feed' } )
   }
   if (userSettings.domesticTopic) {
      xhrTopics.unshift( {id: 'domestic', name: 'Domestic' } )
   }
}

// Define the default custom properties for a new topic (potentially moved to user settings)
function defaultTopicConfig () {
   return { enabled: false, qInterval: 10, qLastRequest: 0, daysOldIgnore: 7 }
}

// Topic object constructor (NOTE: some of these defaults should come from settings)
function Topic( id, captured, custom = defaultTopicConfig(), results = []) {
   return { id, captured, custom, results };
}

function doTopicsResultsNotification(topic, newResults) {
   let msgOptions = {
      type: 'basic',
      title: newResults.length.toString() + ' new job(s) detected!',
      iconUrl: notificationIcon,
      message: 'for saved search: ' + topic.captured.name
   };

   utils.doNotification(msgOptions);
   utils.logMsg({
      'New Results': "'" + topic.captured.name + "' " +
         newResults.length + ' new, ' +  topic.results.length +
         ' total.'
   });

   // NOTE: future enhancement: use have playSound toggle via tipic options
   if (store.state.settings.ui.user.playSound) {
      utils.doSound(notificationMp3);
   }
}