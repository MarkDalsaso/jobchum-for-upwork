import Vue from 'vue';
import Vuex from 'vuex';
import * as utils from '../shared/utils.js';
import jmSettings from '../shared/settings.json';
import notificationIcon from '../shared/notificationIcon'
import notificationMp3 from '../shared/notificationMp3'
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
      updateTopics: ({ dispatch, getters, commit }, payload) => {
         dispatch('fetchFromStorage', 'topics')
            .then( () => {
               return processTopics(payload, getters.topics);
            })
            .then(updatedTopicsAry => {
               commit('topics', updatedTopicsAry)
               dispatch('persistToStorage', 'topics' )
               .then( () => { utils.logMsg(updatedTopicsAry.length + " 'topics' persisted.") })
            })
            .catch(err => { utils.logErr(err); });
      },
      updateTopicResults: ({ dispatch, getters }, payload) => {
         if ('topicId' in payload && typeof payload.topicId != 'undefined') {
            dispatch('fetchFromStorage', 'topics')
               .then( () => {
                  let topicId = Number(payload.topicId);
                  if (topicId == NaN) {
                     utils.logErr("Non-numeric topic id's are not supported.");
                  } else {
                     let topic = getters.getTopicById(topicId)
                     topic.custom.qLastRequest = Date.now()
                     if (topic.custom.enabled) {  // process topic if it's enabled
                        let newResults = newTopicResults(payload.results, topic);
                        if (newResults.length > 0) {
                           topic.results = topic.results.concat(newResults)
                           doTopicsResultsNotification(topic, newResults)
                        }
                     }
                     // Always persist (because qLastResult date needs to be updated)
                     dispatch('persistToStorage', 'topics' )
                     .then( () => {
                        //utils.logMsg("'topics' (TopicResults) mutated and persisted")
                        browser.runtime.sendMessage({'store-update': 'topics'})
                        .then(() => {})
                        .catch(err => { 
                           //NOTE: here is where: "Could not establish connection. Receiving end does not exist." is captured
                           utils.logErr(err);
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
                  commit(rootKeyName, obj[rootKeyName]);    // refresh store
               }
               resolve()
            })
            .catch(err => { utils.logErr(err); });
         });
      },
      persistToStorage: ({ getters }, rootKeyName) => {
         return new Promise(function(resolve) {
            // NOTE: 'payload' is string, representing the root key name,
            //       'settings' or 'topics'
            const objToPersist = getters[rootKeyName]
            //utils.logMsg(utils.storeInfo('before persist', rootKeyName, objToPersist));
            browser.storage.local.set( { [rootKeyName]: objToPersist })
            .then(() => {
               //utils.logMsg(utils.storeInfo('after persist', rootKeyName, objToPersist));
               resolve();
            })
            .catch(err => { utils.logErr(err); });
         })
      },
      initState({ dispatch }) {
         return new Promise(function(resolve) {
            let p1 = dispatch('fetchFromStorage', 'settings');
            let p2 = dispatch('fetchFromStorage', 'topics');
            Promise.all([p1, p2])
               .then(vals => {
                  resolve()
               })
               .catch(err => { utils.logErr(err); });
         });
      },
      initSettingsIfEmpty({ getters, dispatch, commit }) {
         return new Promise(function(resolve) {
            let settings = getters.settings
            //if (Object.keys(getters.settings).length === 0) {
            if ( typeof settings === 'undefined' || Object.keys(settings).length === 0 ) {
               commit('settings', jmSettings)
               dispatch('persistToStorage', 'settings')
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
function newTopicResults(xhrResults, currentTopic) {
   // Check for lost state (may need to always call Ext storage)
   let newResults = [];
   for (let i = 0, len = xhrResults.length; i < len; i++) {
      let daysOldIgnore = currentTopic.custom.daysOldIgnore;
      let xhrResult = xhrResults[i];
      if ( !resultTooOld(daysOldIgnore, xhrResult.publishedOn) ) {
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

function doTopicsResultsNotification(topic, newResults) {
  	   
   let msgOptions = {
      type: 'basic',
      title: newResults.length.toString() +  " new job(s) detected!",
      iconUrl: jmSettings.notification.iconFile,
      message: "for saved search: " + topic.captured.name
   };

   // override iconUrl with data url
   msgOptions.iconUrl = notificationIcon
   utils.doNotification(msgOptions)
   utils.logMsg({ "New Results": "'" + topic.captured.name + "' " + newResults.length + " new, " +  topic.results.length + " total."  })

   // NOTE: future enhancement: use have playSound toggle via tipic options
   if (jmSettings.jobMonkeyUi.playSound) {
      utils.doSound(notificationMp3)
   }
   
}
