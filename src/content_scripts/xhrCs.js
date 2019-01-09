console.log('x1 (xhrCs.js) Load START');

import * as utils from '../shared/utils.js'

// Inject xhr override/monkey patch
var injection = document.createElement('script');
injection.src = chrome.runtime.getURL('content_scripts/x2.js');
(document.head || document.documentElement).appendChild(injection);
injection.onload = function() {
   injection.parentNode.removeChild(injection);
};

// Test only, manifest data not currently used
utils.logMsg({ 'manifest': utils.getManifest() } );  

// this message guarantees popup click works correctly for page action
let pgActionTrigger = {"type": "activate_icon"};
if (utils.supportsBrowserNamespace) {
   browser.runtime.sendMessage(pgActionTrigger);
} 
else if (chrome) {
   chrome.runtime.sendMessage(pgActionTrigger);
}

// listen for messages sent from injection/monkey patch (on DOM Window obj)
window.addEventListener('message', sendDataToBackground, false);

// Use Ext. runtime messaging to send payload to background
function sendDataToBackground(event) {

   // May need a better way to verify msg sent from xhr injection code ???
   if (event.source != window  || event.data.type != 'xhr-capture' ) return;
 
   // NOTE: not sure if 'then' and 'catch' are working.
   let p1 = browser.runtime.sendMessage(event.data);
   p1.then(utils.logMsg('Payload sent to background.'))
      .catch(utils.logErr)

}

