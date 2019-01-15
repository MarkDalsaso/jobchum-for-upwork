import store from '../store'
import * as utils from './utils.js'

export default addListeners;

// Add all background event listeners (by 'browser' or by 'chrome')
function addListeners() {
   browser.runtime.onMessage.addListener(handleMessage)
   browser.runtime.onInstalled.addListener(handleInstall);
}

// handle Install
function handleInstall (details) {
   // NOTE: The following may not be needed, perhaps init when 'processTopics' fires
   //store.dispatch('initBrowserStorage');
   // return Promise.resolve('');   // if a response is needed
}

// handle all extension messages
function handleMessage(message, sender) {
   if (message && message.type) {
      switch (message.type) {
         case 'xhr-capture':
            switch (message.arrayType) {
               case 'rawTopics':
                  store.dispatch('updateTopics', message.arrayObject);
                  break;
               case 'rawResults':
                  //store.dispatch('updateResults', message);
                  store.dispatch('updateTopicResults', { topicId: message.topicId, results: message.arrayObject });
                  break;
            }
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

// NOTE: currently implemented/tested
function handleAlarms() {

   // Listen for "Main alarm"
   //chrome.alarms.onAlarm.addListener(function (alarm) {
   browser.alarms.onAlarm.addListener(function (alarm) {
      
      // IF detected alarm is "Main alarm"
      if (alarm.name === jmSettings.mainAlarm.name) {
      
         // IF main alarm "is on" in Chrome storage userSettings
         doOnSetting("isOn", function (settingValue) {
            if (settingValue) {
               // THEN check to see if any topics need requerying
               requeryMostOverdueTopic();
            }
         });
      }
   });

}

// NOTE: currently implemented/tested
// ********* Do Something based on Chrome Storage userSettings **********
// Execute function callback within chrome storage get of a userSettings
//   Required logic to do ANYTHING based on the value of a user setting
const doOnSetting = function(settingName, callback) {
	const usKeyName = "userSettings";
 
	// fetch "userSettings" node from chrome storage 
	chrome.storage.local.get(usKeyName, function (item) {
	  var userSettings = null;
	  var settingValue = null;
	  if (usKeyName in item)
		 userSettings = item[usKeyName];
 
	  // if userSettings not populated then init from defaults in jmSettings
	  if (userSettings == null) {
		 userSettings = jmSettings.userDefaults;
		 chrome.storage.local.set({
			"userSettings": userSettings
		 });
	  }
	  callback(userSettings[settingName]);
	});
 }
// ****** END OF Do Something based on Chrome Storage userSettings ******