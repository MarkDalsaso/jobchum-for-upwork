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
         dispatch('fetchFromStorage', 'topics')
            .then(topicsAry => {
               return processTopics(payload, topicsAry);
            })
            .then(updatedTopicsAry => {
               dispatch('persistToStorage', { topics: updatedTopicsAry } )
               .then( () => {
                  utils.logMsg("'topics' (TopicResults) mutated and persisted")
                  //browser.runtime.sendMessage({'store-update': 'topic-results'})
               })
            })
            .catch(err => { utils.logErr(err); });
      },
      updateTopicResults: ({ dispatch }, payload) => {
         if ('topicId' in payload && typeof payload.topicId != 'undefined') {
            dispatch('getFromBrowserStorage', 'topics')
               .then(topicsAry => {
                  let topicId = Number(payload.topicId);
                  if (topicId == NaN) {
                     utils.logErr("Non-numeric topic id's are not supported.");
                  } else {
                     let currentTopic = topicsAry.find(topic => topic.id === topicId);
                     let updatedTopicResults = processTopicResults(payload.results, currentTopic);
                     let newTopicCount = updatedTopicResults.length - currentTopic.results.length;
                     //if (newTopicCount > 0) { /*utils.logMsg({newTopicCount: newTopicCount})*/ }
                     let topic = topicsAry.find(topic => topic.id === topicId);
                     topic.results = updatedTopicResults;
                     topic.custom.qLastRequest = Date.now();
                     dispatch('persistToStorage', { topics: topicsAry } )
                     .then( () => {
                        utils.logMsg("'topics' (TopicResults) mutated and persisted")
                        //browser.runtime.sendMessage({'store-update': 'topic-results'})
                     })
                  }
               })
               .catch(err => { utils.logErr(err); });
         }
      },
      persistToStorage: ({ commit }, payload) => {
         return new Promise(function(resolve) {
            const rootKeyName = Object.keys(payload)[0];
            const target = payload[rootKeyName];
            browser.storage.local.set(payload).then(() => {
               utils.logMsg(utils.storeInfo('after set', rootKeyName, target));
               commit(rootKeyName, target);
               resolve();
            })
         })
      },
      fetchFromStorage({ commit, state }, rootKeyName) {
         return new Promise(function(resolve) {
            browser.storage.local
               .get(rootKeyName)
               .then(obj => {
                  utils.logMsg(utils.storeInfo('after get', rootKeyName, obj));
                  if (obj && typeof obj[rootKeyName] !== 'undefined') {
                     commit(rootKeyName, obj[rootKeyName]); // refresh store
                  }
                  resolve(state[rootKeyName]);
               })
               .catch(err => {
                  utils.logErr(err);
               });
         });
      },
      initState({ dispatch }) {
         return new Promise(function(resolve) {
            let p1 = dispatch('fetchFromStorage', 'settings');
            let p2 = dispatch('fetchFromStorage', 'topics');
            Promise.all([p1, p2])
               .then(vals => {
                  resolve()
               })
               .catch(err => {
                  utils.logErr(err);
               });
         });
      },
      initSettingsIfEmpty({ getters, dispatch }) {
         return new Promise(function(resolve) {
            if (Object.keys(getters.settings).length === 0) {
               dispatch('persistToStorage', { settings: jmSettings })
               .then( () => {
                  utils.logMsg('default settings have been initialized');
                  resolve();
               });
            } else {
               resolve();
            }
         }).catch(err => { utils.logErr(err); });
      },
      wipeExtensionState({ commit }) {
         browser.storage.local.clear()
         .then(() => {
            commit('settings', {});
            commit('topics', []);
         })
         .catch(err => { utils.logErr(err); });
      }
   }
});

// Process the captured xhrResults array.
function processTopicResults(xhrResults, currentTopic) {
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
function processTopics(xhrTopics, currentTopics) {
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
