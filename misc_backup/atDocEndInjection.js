import settings from '../src/content_scripts/jmDefaultSettings.js';

var jmUtils = jmUtils || {};

jmUtils.atDocEnd = (function() {
   var returnObj = {};
   var topicSelector = settings.userDefaults.topicsSelector;

   // POST msg (to "self", see message event listener in xhrMpLoader.js)
   if (returnObj) {
      //window.postMessage(returnObj, '*');
   }
})();
