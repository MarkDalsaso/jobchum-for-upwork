import store from '../store'
import browserInfo from './browserInfo.js';

export default addListeners;

// Add all background event listeners (by 'browser' or by 'chrome')
function addListeners() {
   if (browserInfo.supportsBrowserNamespace) {
      // add 'browser' message listener
      browser.runtime.onMessage.addListener(handleMessage);
      browser.runtime.onInstalled.addListener(handleInstall)
   } 
   else if (chrome) {
      // add 'chrome' message listener
      chrome.runtime.onMessage.addListener(handleMessage);
      chrome.runtime.onInstalled.addListener(handleInstall)
   }
}

// handle Install
function handleInstall (details) {
   store.dispatch('initBrowserStorage');
}

// handle all extension messages
function handleMessage(message, sender, sendResponse) {
   if (message && message.type) {
      switch (message.type) {
         case 'jmCap':
            switch (message.arrayType) {
               case 'rawTopics':
                  //processTopics(message.arrayObject);
                  store.dispatch('processTopics', message.arrayObject);
                  break;
               case 'rawResults':
                  //processResults(message.arrayObject, message.topicId);
                  store.dispatch('processResults', message.arrayObject);
                  break;
            }
            break;
         case 'activate_icon':
            // this guarantees popup click works correctly for page action
            chrome.pageAction.show(sender.tab.id);
            break;
      }
      sendResponse('message received by background');
      console.log({ 'message from content script': message });
   }
}
