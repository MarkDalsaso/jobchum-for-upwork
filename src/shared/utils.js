/* Utility functions
         Usage import named exports individually:
   import { devMode, logMsg, logErr } from 'utils.js'
         or ...
   import * as utils from 'utils.js'
*/

export function logMsg(msg) {
   let m = msg instanceof Object ? msg : { msg: msg };
   console.log(m);
}

export function logErr(err) {
   let m = err instanceof Object ? err : { err: err };
   console.log(m);
}

export function storeInfo(type, name, value) {
   let length = "n/a"
   if (Array.isArray(value)) {
      length = value.length
   } else if (typeof value === 'object') {
      length = Object.keys(value).length
   }
   return { 
      [type]: {
         "0-key": name,
         "1-target": value,
         "2-typeof target": typeof value,
         "3-length of target": length
      }
   }
}

export const devMode = setDevMode();

// Always sync-up main alarm to the main switch
export function syncAlarmToMainSwitch(settings) {
   settings.jobMonkeyUi.isOn ?
      browser.alarms.create(settings.mainAlarm.name, settings.mainAlarm.info) :
      browser.alarms.clear(settings.mainAlarm.name)
}

// NOTE: Not completely tested
// Determine if extentions is in develeopment mode by testing for existence
//   (or not) of certain keys in the manifest, or id signature, or whaever
function setDevMode() {
   let inDevMode = false;

   // Logic for Firefox. 'getBrowserInfo' is only supported by Firefox
   if (typeof browser.runtime.getBrowserInfo !== 'undefined') {
      // Check for existence of the workd 'temporary' in Ext. id
      let id = browser.runtime.id;
      if (RegExp('temporary', 'i').test(id)) inDevMode = true;

      //  Logic for Chrome (probably will break in Opera, Edge, etc.  ??? ))
   } else {
      // Check for existence of 'update_url' key in manifest json
      let manifest = browser.runtime.getManifest();
      if (typeof manifest.update_url == 'undefined') inDevMode = true;
   }
   return inDevMode;
}

//logMsg({'deveMode': devMode})
