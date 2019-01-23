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
   .catch(err => { utils.logErr(err); }); ;
}

// handle all extension messages (from extension api)
function handleMessage(message, sender) {
   if (message && message.type) {
      switch (message.type) {
         case 'xhr-capture':
            /*
                NOTE: Once requeryMostOverdueTopic() working then test this out
                      essentially, if main switch is off then skip ALL updates
            */
            //store.dispatch('fetchFromStorage', 'settings')
            //.then(settings => {
            //   if (settings.jobMonkeyUi.isOn) {
                  switch (message.arrayType) {
                     case 'rawTopics':
                        store.dispatch('updateTopics', message.arrayObject);
                        break;
                     case 'rawResults':
                        //store.dispatch('updateResults', message);
                        store.dispatch('updateTopicResults', { topicId: message.topicId, results: message.arrayObject });
                        break;
                  }
            //   }
            //})
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

// Listen for "Main alarm"
function handleAlarms(alarm) {
   store.dispatch('fetchFromStorage', 'settings')
   .then(settings => {
      if ( alarm.name === settings.mainAlarm.name && settings.jobMonkeyUi.isOn ) {
            requeryMostOverdueTopic()
         }
   });
}

 // Logic requered find oldest overdue topic
 function requeryMostOverdueTopic () {
   utils.logMsg("mainAlarm (requeryMostOverdueTopic) has fired")
    /*
   store.dispatch('fetchFromStorage', 'topics')
   .then(topics => {
      utils.logMsg("mainAlarm has fired")
   });
   */
 }