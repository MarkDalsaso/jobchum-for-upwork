import browserInfo from '../browserInfo.js';
import processTopics from './processTopics.js';
import processResults from './processResults.js';

export default addListeners;

// Add all background event listeners (by 'browser' or by 'chrome')
function addListeners() {
   if (browserInfo.supportsBrowserNamespace) {
      // add 'browser' message listener
      browser.runtime.onMessage.addListener(handleMessage);
   } 
   else if (chrome) {
      // add 'chrome' message listener
      chrome.runtime.onMessage.addListener(handleMessage);
   }
}

// handle all extension messages
function handleMessage(message, sender, sendResponse) {
   if (message && message.type) {
      switch (message.type) {
         case 'jmCap':
            switch (message.arrayType) {
               case 'rawTopics':
                  processTopics(message.arrayObject);
                  break;
               case 'rawResults':
                  processResults(message.arrayObject, message.topicId);
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
