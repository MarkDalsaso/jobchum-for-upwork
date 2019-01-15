import Vue from 'vue';
import Vuex from 'vuex';
import * as utils from '../shared/utils.js';
Vue.use(Vuex);

const rootTopicsKey = 'jmTopics';
const jmInitialState = {
   settings: {},
   topics: []
};

export default new Vuex.Store({
   // The 'source of truth' that drives the app
   state: jmInitialState,
   getters: {
      topics: state => state.topics,
      settings: state => state.settings,
      getTopicById: (state) => (id) => {
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
      updateTopics: ({ dispatch, commit, state, getters }, payload) => {
         dispatch('getFromBrowserStorage', 'topics')
         .then(topicsAry => {
            return updateTopics(payload, topicsAry);
         })
         .then(updatedTopicsAry => {
            let p2 = browser.storage.local.set( {'topics': updatedTopicsAry} );
            p2.then( () => {
               commit('topics', updatedTopicsAry);
               utils.logMsg({ 'updateTopics action has mutated \'topics\'': updatedTopicsAry });
            });        
         })
         .catch(err => { utils.logErr(err); });
      },
      updateTopicResults: ({ dispatch, commit }, payload) => {
         if ('topicId' in payload && typeof payload.topicId != "undefined") {
            dispatch('getFromBrowserStorage', 'topics')
            .then(topicsAry => {
               let topicId = Number(payload.topicId);
               if (topicId == NaN) {
                  utils.logErr("Non-numeric topic id's are not supported.")
               } else {
                  let currentTopic = topicsAry.find(topic => topic.id === topicId);
                  let updatedTopicResults = updateTopicResults(payload.results, currentTopic);
                  let topic = topicsAry.find(topic => topic.id === topicId);
                  topic.results = updatedTopicResults;
                  topic.custom.qLastRequest = Date.now();
                  let p2 = browser.storage.local.set( {'topics': topicsAry} );
                  p2.then( () => {
                     commit('topics', topicsAry);    // commit updated topics
                     utils.logMsg({ 'updateTopicResults action has mutated \'topics\'': topicsAry });
                  });
               }
            })
            .catch(err => { utils.logErr(err); });
         }
      },
      getFromBrowserStorage({commit}, rootKeyName) {
         // NOTE: 'rootKeyName' is the payload and is a string
         return new Promise(function(resolve, reject) {
            browser.storage.local.get(rootKeyName)
            .then(obj => {
               if (Object.keys(obj).length == 0)
                  return resolve(jmInitialState[rootKeyName]);
               else
                  // NOTE: "get" returns key-value mappings, (not just the value).
                  commit(rootKeyName, obj[rootKeyName]);    // refresh store     
                  return resolve(obj[rootKeyName]);
            }).catch(err => { utils.logErr(err); });
         })
      }
   }
});

// Process the captured xhrResults array.
function updateTopicResults(xhrResults, currentTopic) {
   // Check for lost state (may need to always call Ext storage)
   let updatedTopicResults = currentTopic.results;
   for (let i = 0, len = xhrResults.length; i < len; i++ ) {
      let xhrResult = xhrResults[i];
      if ( !resultTooOld(currentTopic.custom.daysOldIgnore, xhrResult.publishedOn) ) {
         if ( !(currentTopic.results.find(r => r.recno === xhrResult.recno)) ) {
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
   let rtnAry = [], xhrTopic = {}, curTopic = {};
   for (let i = 0, len = xhrTopics.length; i < len; i++ ) {
      xhrTopic = xhrTopics[i];
      curTopic = currentTopics.find(t => t.id === xhrTopic.id);
      if (curTopic) {
         // Add new topic, preserve existing 'custom' and 'results' props from 'curTopic'
         rtnAry.push(new Topic(xhrTopic.id, xhrTopic, curTopic.custom, curTopic.results));
      } else {
         // Add new Topic
         rtnAry.push(new Topic(xhrTopic.id, xhrTopic));
      }
   }
   return rtnAry;
}

// Topic object constructor (NOTE: some of these defaults should come from settings)
function Topic(id, captured, custom = {enabled: false, qInterval: 10, qLastRequest: 0, daysOldIgnore: 7}, results = []) {
   return { id, captured, custom, results };
}

/* NOTE: see: C:\Users\MarkD\Desktop\0 Training And Learning\1 - Modern JS Development\Vue.js\Udemy\Vue JS 2 The Complete Guide\3AxiosModuleProject
         'store.js' module for great examples on commiting and
         dispatching and proper handling of asynchronous storage calls
*/

// NOTE: see https://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates#Decoding-the-Date
//       for date decoding. Needed for new {daysOldIgnore: 14} property

// NOTE: see https://www.andygup.net/fastest-way-to-find-an-item-in-a-javascript-array/
//       for fast JS Array search, and fiddle here: http://jsfiddle.net/agup/Y8SBL/11/
