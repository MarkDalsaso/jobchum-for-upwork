//console.log('x2 (xhrInjection.js) Load START');
import xhrCaptureDefs from './xhrCaptureDefs.json';

var utils = utils || {};

// Monkey patch xhr for data extraction. Arg's open and send are references
// to the original xhr open and send methods
utils.xhrMp = (function(open, send) {

   // Closure/state var's
   const xhrDefs = xhrCaptureDefs.defs;
   const errMsg = [];
   var xhrOpenRequestUrl;  // captured in open override/monkey patch
   var xhrSendResponseUrl; // captured in send override/monkey patch

   // Monkey patch xhr "open" method, to capture request url, (for later use)
   XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      xhrOpenRequestUrl = url; // update request url, closure variable
      open.apply(this, arguments); // reset/reapply original open method
   };

   // Monkey path xhr "send" method, and extract target properties from parsed JSON
   XMLHttpRequest.prototype.send = function(data) {
      this.onreadystatechange = function() {

         if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            xhrSendResponseUrl = this.responseURL;

            // loop thru the xhr Target Def's to determine if current xhr is match
            for (var i = 0; i < xhrDefs.length; i++) {

               // RegEx test the 'responseURL' (the final, serialized url, after any redirects)
               if (RegExp(xhrDefs[i].urlSignature, 'i').test(xhrSendResponseUrl)) {

                  // if a match then build an array of custom/dynamic objects
                  let objAry = buildObjectArray(xhrDefs[i], this.response);

                  // if objAry not null then wrap it and dispatch message event
                  if (objAry) {
                     postResults(xhrDefs[i], objAry);
                  }
               }
            }
         }
      };
      send.apply(this, arguments); // reset/reapply original send method
   };

   // Build dynamic object, (uses "capture" node to cherry pick stuff from JSON payload
   function buildObjectArray(xhrDef, httpResonse) {
      var returnAry = null;
      var rspObj = isJson(httpResonse);

      // go no further if response doesn't contain JSON
      if (!rspObj) {
         errMsg.push('Target url found but response is not formatted as JSON.');
         return;
      }

      // go no further if the target (from http respone) data is falsy, 
      //    or not an array, or an empty array
      var targetAry = rspObj[xhrDef.capture.targetAryProp];
      var defStr = "('" + xhrDef.capture.targetAryProp + "' prop. of def: '" + xhrDef.defId + "')";
      if (!targetAry || !Array.isArray(targetAry)) {
         errMsg.push('Warning: Target property ' + defStr + ' not found or is not array.');
         return;
      } else if (targetAry.length === 0) {
         errMsg.push('Target property' + defStr + ' is an empty array, skip further processing.');
         return;
      }

      // if made it this far then we've target data to process
      returnAry = []; // if made it this far then we've target data to process

      // loop thru items in the targeted array, (in the http response text)
      for (var i = 0; i < targetAry.length; i++) {

         // create a new object dynamically, with just the properties being targeted
         var obj = {};
         var props = xhrDef.capture.targetSubProps;

         if (props === '*') {
            obj = targetAry[i];
         } else {
            for (var j = 0; j < props.length; j++) {
               obj[props[j]] = targetAry[i][props[j]]; // easy now big fella!
            }
         }

         returnAry.push(obj); // append the new object to the array
      }
      return returnAry;
   }

   // Build object to send pack to the content script
   function postResults(xhrDef, objAry) {

      var returnObj = {
         arrayObject: objAry,
         arrayType: xhrDef.defId,
         type: 'xhr-capture'
      };

      // if harvesting "rawResults" then append topicId (also check for standard topics)
      if (xhrDef.defId === 'rawResults') {
         let tId = getQueryStringValue(xhrSendResponseUrl, 'topic')
         if (tId) {
            returnObj.topicId = tId
         } else {
            // NOTE: qs param 'since_result_set_ts' is the flag for the narrow horiz
            //       rect. (w. green font). " There are new jobs. Click to see them."
            //       To ignore these, send querystring back to "bgListener.js" with
            //        'returnObj', to evaluate and skip  notification based on setting
            // "My Job Fed" https://www.upwork.com/ab/find-work/api/feeds/search?since_result_set_ts=1549918103063
            // "U.S. Only" (domestic) https://www.upwork.com/ab/find-work/api/feeds/search?since_result_set_ts=1549918955633&user_location_match=1 
            //tId = getQueryStringValue(xhrSendResponseUrl, '?since_result_set_ts=')
            tId = getQueryStringValue(xhrSendResponseUrl, 'user_location_match')
            if (tId) {
               returnObj.topicId = 'domestic'
            } else {
               returnObj.topicId = 'myfeed'
            }
         }
      }

      // for development testing
      var logObj = {
         xhrDef: xhrDef,
         "xhrOpenRequestUrl": xhrOpenRequestUrl,
         "xhrSendResponseUrl": xhrSendResponseUrl,
         zErrors: errMsg     
      };

      // Comment out following for production
      returnObj.logObj = logObj;

      // POST msg back content script
      window.postMessage(returnObj, '*');
   }

   // regEx to pluck val from querystring. Nicked from https://css-tricks.com/snippets/javascript/get-url-variables/
   function getQueryStringValue(url, qsName) {
      var qsVal = url.match(new RegExp("[\?\&]" + qsName + "=([^\&]*)(\&?)","i"));
      return qsVal ? qsVal[1] : qsVal;
   }

   // If some text is JSON, return parsed JSON, else return false
   function isJson(str) {
      let rtn = false;
      try {
         rtn = JSON.parse(str);
      } catch (err) {
         errMsg.push('Unable to parse JSON, JS err msg: ' + err.message);
      }
      return rtn;
   }

   })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
