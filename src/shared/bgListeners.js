import {store} from '../store';
import * as utils from './utils.js';
export default addListeners;

// Add all background event listeners (by 'browser' or by 'chrome')
function addListeners() {
   browser.runtime.onInstalled.addListener(handleInstall);
   browser.runtime.onMessage.addListener(handleMessage);
   browser.alarms.onAlarm.addListener(handleAlarms);
}

//utils.logMsg({ "state initialized": store.state.initialized.toString()})

function handleInstall(details) {
   store.dispatch('loadStateFromStorage')
   .then ( () => {
      utils.logMsg( {"state initialized": store.state} )
      utils.syncAlarmToMainSwitch(store.getters.settings);
      const url = store.getters.settings.sys.requeryBaseUrl;
      browser.tabs.create({ active: true, url: url })
      //.then( () => { utils.logMsg("tabs.create fired") })
      .catch(err => { utils.logErr(err); });
   })
   .catch(err => { utils.logErr(err); });
}

// handle all extension messages (from extension api)
function handleMessage(message, sender) {
   if (message && message.type) {
      switch (message.type) {
         case 'xhr-capture':
            store.dispatch('fetchFromStorage', 'settings')
            .then(() => {
               switch (message.arrayType) {
                  case 'rawTopics':
                     store.dispatch('updateTopics', message.arrayObject);
                     break;
                  case 'rawResults':
                     // NOTE: only update topic results if main switch is on
                     if (store.getters.settings.ui.auto.isOn === true) {
                        store.dispatch('updateTopicResults', {
                           topicId: message.topicId,
                           results: message.arrayObject
                        })
                        .catch(err => { utils.logErr(err); });
                     }
                     break;
               }
            });
            break;
         case 'activate_icon':
            // this guarantees popup click works correctly for page action
            store.dispatch('fetchFromStorage', 'settings')
            .then( () => {
               browser.pageAction.show(sender.tab.id);
               utils.updateLastTabId(store, sender.tab.id)
               utils.setPageActionIcon(store.getters.settings)
            })
            break;
      }
      //utils.logMsg({ 'msg. from content script': message });
   }
   // "Dummy response to keep the console quiet" see: https://github.com/mozilla/webextension-polyfill/issues/130
   return Promise.resolve('dummy');
}

// Listen for "Main alarm" (settings.sys.mainAlarm)
function handleAlarms(alarm) {
   store.dispatch('fetchFromStorage', 'settings')
   .then(() => {
      const settings = store.getters.settings;
      if (alarm.name === settings.sys.mainAlarm.name && settings.ui.auto.isOn === true) {
         requeryMostOverdueTopic();
      }
   });
}

// Logic requered find oldest overdue topic
function requeryMostOverdueTopic() {
   store
      .dispatch('fetchFromStorage', 'topics')
      .then(() => {
         const topics = store.getters.topics;
         const overdueTopics = topics.filter(topic => {
            let isOverdue = false; // default to not overedue
            if (topic.custom.enabled) {
               const interval = topic.custom.qInterval;
               const lastRequest = topic.custom.qLastRequest;
               const nextQuery = lastRequest + interval * 60 * 1000;
               isOverdue = nextQuery < Date.now();
            }
            return isOverdue;
         });

         if (overdueTopics.length === 0) return; // nothing to do get out
         overdueTopics.sort(function(a, b) {
            return a.custom.qLastRequest - b.custom.qLastRequest;
         });
         utils.reQueryById(store, overdueTopics[0].id);
         // utils.logMsg({
         //    "overdue topic id": overdueTopics[0].id,
         //    "overdue topic name": overdueTopics[0].captured.name,
         // })
      })
      .catch(err => { utils.logErr(err);  });
}
