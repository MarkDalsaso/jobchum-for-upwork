import Vue from 'vue';
import Vuex from 'vuex';
import * as utils from '../shared/utils.js';
import jmSettings from '../shared/settings.json';
Vue.use(Vuex);

export default new Vuex.Store({
   // The 'source of truth' that drives the app
   state: { settings: {}, topics: [] },
   getters: {
      topics: state => state.topics,
      settings: state => state.settings,
      getTopicById: state => id => {
         return state.topics.find(topic => topic.id === id);
      }
   },
   mutations: {
      topics(state, payload) {
         state.topics = payload;
      },
      settings(state, payload) {
         state.settings = payload;
      }
   },
   actions: {
      updateTopics: ({ dispatch, commit }, payload) => {
         dispatch('getFromBrowserStorage', 'topics')
            .then(topicsAry => {
               return updateTopics(payload, topicsAry);
            })
            .then(updatedTopicsAry => {
               let p2 = browser.storage.local.set({ topics: updatedTopicsAry });
               p2.then(() => {
                  commit('topics', updatedTopicsAry);
                  utils.logMsg({
                     "updateTopics action has mutated 'topics'": updatedTopicsAry
                  });
               });
            })
            .catch(err => {
               utils.logErr(err);
            });
      },
      updateTopicResults: ({ dispatch, commit }, payload) => {
         if ('topicId' in payload && typeof payload.topicId != 'undefined') {
            dispatch('getFromBrowserStorage', 'topics')
               .then(topicsAry => {
                  let topicId = Number(payload.topicId);
                  if (topicId == NaN) {
                     utils.logErr("Non-numeric topic id's are not supported.");
                  } else {
                     let currentTopic = topicsAry.find(
                        topic => topic.id === topicId
                     );
                     let updatedTopicResults = updateTopicResults(
                        payload.results,
                        currentTopic
                     );
                     let topic = topicsAry.find(topic => topic.id === topicId);
                     topic.results = updatedTopicResults;
                     topic.custom.qLastRequest = Date.now();
                     browser.storage.local
                        .set({ topics: topicsAry })
                        .then(() => {
                           commit('topics', topicsAry); // commit updated topics
                           utils.logMsg({
                              "updateTopicResults action has mutated 'topics'": topicsAry
                           });
                        });
                  }
               })
               .catch(err => {
                  utils.logErr(err);
               });
         }
      },
      updateSettings: ({ commit }, settingsObj) => {
         browser.storage.local.set({ settings: settingsObj }).then(() => {
            commit('settings', settingsObj); // commit updated settings
            utils.logMsg({ "updateSettingss mutated 'settings'": settingsObj });
         });
      },
      getFromBrowserStorage({ commit, state }, rootKeyName) {
         // NOTE: 'rootKeyName' is the payload and is a string
         return new Promise(function(resolve, reject) {
            browser.storage.local
               .get(rootKeyName)
               .then(obj => {
                  if (Object.keys(obj).length > 0) {
                     commit(rootKeyName, obj[rootKeyName]); // refresh store
                     return resolve(obj[rootKeyName]);
                  } else {
                     return resolve(state[rootKeyName]);
                  }
               })
               .catch(err => {
                  utils.logErr(err);
               });
         });
      },
      initializeSettings({ dispatch, commit }) {
         dispatch('getFromBrowserStorage', 'settings').then(
            settingsValueObj => {
               if (Object.keys(settingsValueObj).length == 0) {
                  browser.storage.local
                     .set({ settings: jmSettings })
                     .then(() => {
                        commit('settings', jmSettings);
                        utils.logMsg('default settings saved to browser');
                     });
               }
            }
         );
      },
      initVuexState({ dispatch }) {
         dispatch('initializeSettings');
         dispatch('getFromBrowserStorage', 'topics');
      },
      wipeExtensionState({ commit }) {
         browser.storage.local
            .clear()
            .then(() => {
               commit('settings', {});
               commit('topics', []);
            })
            .catch(err => {
               utils.logErr(err);
            });
      }
   }
});

// Process the captured xhrResults array.
function updateTopicResults(xhrResults, currentTopic) {
   // Check for lost state (may need to always call Ext storage)
   let updatedTopicResults = currentTopic.results;
   for (let i = 0, len = xhrResults.length; i < len; i++) {
      let xhrResult = xhrResults[i];
      if (
         !resultTooOld(currentTopic.custom.daysOldIgnore, xhrResult.publishedOn)
      ) {
         if (!currentTopic.results.find(r => r.recno === xhrResult.recno)) {
            updatedTopicResults.push(xhrResult);
         }
      }
   }
   return updatedTopicResults;
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
function updateTopics(xhrTopics, currentTopics) {
   let rtnAry = [],
      xhrTopic = {},
      curTopic = {};
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

// Topic object constructor (NOTE: some of these defaults should come from settings)
function Topic(
   id,
   captured,
   custom = {
      enabled: false,
      qInterval: 10,
      qLastRequest: 0,
      daysOldIgnore: 7
   },
   results = []
) {
   return { id, captured, custom, results };
}
