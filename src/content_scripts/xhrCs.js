console.log('x1 (xhrCs.js) Load START');

import * as utils from '../shared/utils.js';

createAndInjectMonkeyPatch();

const standardRspMsg = 'Response from background listener';
sendPageActionTrigger();

// listen for messages sent from injection/monkey patch (on DOM Window obj)
window.addEventListener('message', sendXhrDataToBackground, false);

// Use Ext. runtime messaging to send payload to background
function sendXhrDataToBackground(event) {
   // May need a better way to verify msg sent from xhr injection code ???
   if (event.source != window || event.data.type != 'xhr-capture') return;

   // Send msg with payload to background
   let p1 = browser.runtime.sendMessage(event.data);
   p1.then(response => {
      utils.logMsg({ [standardRspMsg]: response });
   }).catch(err => {
      utils.logErr(err);
   });
}

// Create and inject script node for xhr override/monkey patch
function createAndInjectMonkeyPatch() {
   // Create script node
   const injectionRelativePath = 'content_scripts/x2.js';
   let injection = document.createElement('script');
   injection.src = browser.runtime.getURL(injectionRelativePath);
   // Inject script node
   (document.head || document.documentElement).appendChild(injection);
   injection.onload = function() {
      injection.parentNode.removeChild(injection);
   };
}

// Send msg (to background) to trigger 'pageAction.show'; to ensure popup works
function sendPageActionTrigger() {
   let prm = browser.runtime.sendMessage({ type: 'activate_icon' });
   prm.then(response => {
      utils.logMsg({ [standardRspMsg]: response });
   }).catch(err => {
      utils.logErr(err);
   });
}
