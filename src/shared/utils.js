/* Utility functions. Usage: import named exports individually...
   import { devMode, logMsg, logErr } from 'utils.js'
         or ...
   import * as utils from 'utils.js'
*/
import sysSettings from './settings.json';
export function logMsg(msg) {
   let m = msg instanceof Object ? msg : { msg: msg };
   console.log(m);
}

export function logErr(err) {
   //let m = err instanceof Object ? err : { err: err };
   console.log({ Error: err });
}

export function storeInfo(type, name, value) {
   let length = 'n/a';
   if (Array.isArray(value)) {
      length = value.length;
   } else if (typeof value === 'object') {
      length = Object.keys(value).length;
   }
   return {
      [type]: {
         '0-key': name,
         '1-target': value,
         '2-typeof target': typeof value,
         '3-length of target': length
      }
   };
}

// Always sync-up main alarm to the main switch
export function syncAlarmToMainSwitch(settings) {
   let alarm = settings.sys.mainAlarm
   if (settings.ui.auto.isOn) {
      const delayInMinutes = alarm.info.delayInMinutes;
      const periodInMinutes = alarm.info.periodInMinutes;
      browser.alarms.create(alarm.name, {
         delayInMinutes,
         periodInMinutes
      });
   } else {
      browser.alarms.clear(alarm.name)
      .catch(err => { logErr(err); });
   }
}

// NOTE: Not completely tested
// Determine if extentions is in develeopment mode by testing for existence
//   (or not) of certain keys in the manifest, or id signature, or whaever
export const devMode = setDevMode();
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

   //inDevMode = false;  // Testing 
   return inDevMode;
}

export function reQueryById(topicId) {
   let url = sysSettings.sys.requeryBaseUrl
   let codeObj = {}
   browser.tabs.query({ url: url + '*' })
   .then(tabs => {
      if (tabs.length > 0) {
         if (topicId === 'myfeed') {
            codeObj.code = clickSavedSearchJs("My Feed")
         } else {
            codeObj.code = "window.location.replace('" + url + topicId + "')"
         }
         browser.tabs.executeScript(tabs[0].id, codeObj)
      }
   })
   .catch(err => { logErr(err); });;
}

// Note: currently only used fo "My Feed". If left-side topics panel
//   is hidden, THIS WILL NOT WORK
function clickSavedSearchJs(ssName) {
   const rtn = `
   var u = window.location.href, n, i;
   n = document.querySelectorAll(\"[data-topic-list=''] > ul > li\");
   if (n) {
      for (i = 0; i < n.length; i++) {
         if (n[i].textContent.trim() === '${ssName}') {
            n[i].click();
            break;
         }
      }
   };
   `
   return rtn;
}

export function openAuxilaryWindow (url, auxWinType = 1, makeTabActive = true, winOpenParams = "width=460,height=650") {
   // "browser.tabs.create: is the default (reserved for #1) 
   // "window.open" (case #2), params "width=460,height=650" mimicks ext. popup
   switch(auxWinType) {
      case 2:    /*      USE window.open      */
         // fyi: params = 
         window.open(url, "", winOpenParams)
         break
      default:    /*     USE browser.tabs.create  */
         browser.tabs.create({ url: url, active: makeTabActive  })
         //.then( () => {} ) 
         .catch(err => {utils.logErr(err); });   
         break
   }
}

// Init and invoke basic notification
export function doNotification(msgOptions) {
   browser.notifications.create(msgOptions)
      .then(() => {
         //logMsg("notification fired")
      })
      .catch(err => { logErr(err); });
}

export function doSound(soundFile) {
   if (soundFile) {
      let audio = new Audio(soundFile);
      audio.play();
   }
}

//logMsg({'deveMode': devMode})
