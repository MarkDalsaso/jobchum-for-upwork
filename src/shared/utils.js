/* Utility functions
         Usage import named exports individually:
   import { devMode, logMsg, logErr } from 'utils.js'
         or ...
   import * as utils from 'utils.js'
*/

export function logMsg(msg) {
   let m = msg instanceof Object ? msg : { 'msg': msg }
   console.log(m);
}

export function logErr(err) {
   let m = err instanceof Object ? err : { 'err': err }
   console.log(m);
}

export const devMode = setDevMode();

// NOTE: Not completely tested
// Determine if extentions is in develeopment mode by testing for existence 
//   (or not) of certain keys in the manifest, or id signature, or whaever
function setDevMode() {
   let inDevMode = false;

   // Logic for Firefox. 'getBrowserInfo' is only supported by Firefox 
   if (typeof browser.runtime.getBrowserInfo !== 'undefined') {
      // Check for existence of the workd 'temporary' in Ext. id
      let id = browser.runtime.id;
      if (RegExp('temporary', 'i').test(id))
         inDevMode = true;

   //  Logic for Chrome (probably will break in Opera, Edge, etc.  ??? ))         
   } else {
      // Check for existence of 'update_url' key in manifest json
      let manifest = browser.runtime.getManifest();
      if (typeof manifest.update_url == "undefined") 
         inDevMode = true;        
   }
   return inDevMode;
}

logMsg({'deveMode': devMode})
