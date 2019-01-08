console.log('x1 (xhrCs.js) Load START');

import browserInfo from '../shared/browserInfo.js';

// Inject xhr monkey patch
var injection = document.createElement('script');
injection.src = chrome.runtime.getURL('content_scripts/x2.js');
(document.head || document.documentElement).appendChild(injection);
injection.onload = function() {
   injection.parentNode.removeChild(injection);
};

window.addEventListener('message', sendDataToBackground, false);

// this message guarantees popup click works correctly for page action
chrome.runtime.sendMessage({"type": "activate_icon"});

function sendDataToBackground(event) {

   // May need a better way to verify msg sent from xhr injection code ???
   if (event.source != window  || event.data.type != 'jmCap' ) return;

   let m2 = chrome.runtime.getManifest();

   if (browserInfo.supportsBrowserNamespace) {
      // browser API 'sendMessage' returns a Promise,  if something
      //   needs to be returned from the event listener, ""...onMessage.addListener"
      let sending = browser.runtime.sendMessage(event.data);
      sending.then(handleResponse, handleError);
   } else if (chrome) {
      // Chrome 'sendMessage' uses an optional response callback, if something
      //   needs to be returned from the event listener, ""...onMessage.addListener"
      chrome.runtime.sendMessage(event.data, function(response) {
         if (chrome.runtime.lastError) handleError(chrome.runtime.lastError);
         else handleResponse(response);
      });
   }
}

function handleResponse(response) {
   console.log(response);
}

function handleError(error) {
   console.log( {error});
}
