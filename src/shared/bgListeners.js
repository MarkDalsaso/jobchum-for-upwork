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