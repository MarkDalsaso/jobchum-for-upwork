import store from '../store'
import * as utils from './utils.js'

export default addListeners;

// Add all background event listeners (by 'browser' or by 'chrome')
function addListeners() {
   browser.runtime.onInstalled.addListener(handleInstall)
   browser.runtime.onMessage.addListener(handleMessage)
   browser.alarms.onAlarm.addListener(handleAlarms)
}

// handle Install (initialize default settings from json)
function handleInstall (details) {
   store.dispatch('fetchFromStorage', 'settings')
   .then(() => {
      store.dispatch('initSettingsIfEmpty')
      .then(() => {
         utils.syncAlarmToMainSwitch(store.getters.settings)
      })
   })
   .catch(err => { utils.logErr(err); });
}

// handle all extension messages (from extension api)
function handleMessage(message, sender) {
   if (message && message.type) {
      switch (message.type) {
         case 'xhr-capture':
            store.dispatch('fetchFromStorage', 'settings')
            .then( () => {
               switch (message.arrayType) {
                  case 'rawTopics':
                     store.dispatch('updateTopics', message.arrayObject);
                     break;
                  case 'rawResults':
                     // NOTE: only update topic results if main switch is on
                     if (store.getters.settings.jobMonkeyUi.isOn) {
                        store.dispatch('updateTopicResults', { topicId: message.topicId, results: message.arrayObject });
                     }
                     break;
                  }
            })
            break;
         case 'activate_icon':
            // this guarantees popup click works correctly for page action
            browser.pageAction.show(sender.tab.id);
            break;
      }
      //utils.logMsg({ 'msg. from content script': message });
      return Promise.resolve('msg. type: \'' + message.type + '\', received and processed by background.');   // testing only (not req.)
   }
}

// Listen for "Main alarm" (settings.mainAlarm)
function handleAlarms(alarm) {
   store.dispatch('fetchFromStorage', 'settings')
   .then( () => {
      const settings = store.getters.settings
      if ( alarm.name === settings.mainAlarm.name && settings.jobMonkeyUi.isOn ) {
            requeryMostOverdueTopic()
      }
   });
}

 // Logic requered find oldest overdue topic
 function requeryMostOverdueTopic () {
   store.dispatch('fetchFromStorage', 'topics')
   .then( () => {
      const topics = store.getters.topics
      const overdueTopics = topics.filter(topic => {
         let isOverdue = false	// default to not overedue
         if (topic.custom.enabled) {
            const interval = topic.custom.qInterval
            const lastRequest = topic.custom.qLastRequest
            const nextQuery = lastRequest + (interval * 60 * 1000)
            isOverdue = (nextQuery < Date.now())
         }
         return isOverdue
      })

      if (overdueTopics.length === 0) return;  // nothing to do get out
      overdueTopics.sort(function (a, b) {
         return a.custom.qLastRequest - b.custom.qLastRequest;
      });

      utils.reQueryById(overdueTopics[0].id)
      utils.logMsg({
         "overdue topic id": overdueTopics[0].id,
         "overdue topic name": overdueTopics[0].captured.name,
      })
   }).catch(err => { utils.logErr(err); })
}
