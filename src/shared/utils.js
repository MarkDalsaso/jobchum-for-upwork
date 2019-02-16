/* Utility functions. Usage: import named exports individually...
   import { devMode, logMsg, logErr } from 'utils.js'
         or ...
   import * as utils from 'utils.js'
*/
import sysSettings from './settings.json';
import extActionIcon48 from './extActionIcon48';
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
   if ( isFirefox() ) {
      // Check for existence of the workd 'temporary' in Ext. id
      let id = browser.runtime.id;
      if (RegExp('temporary', 'i').test(id)) inDevMode = true;

   //  Logic for Chrome (may break in Opera, Edge, etc.  ??? )
   } else {
      // Check for existence of 'update_url' key in manifest json
      let manifest = browser.runtime.getManifest();
      if (typeof manifest.update_url == 'undefined') inDevMode = true;
   }

   //inDevMode = false;  // Testing 
   return inDevMode;
}

export function isFirefox() {
   // based on the fact that 'getBrowserInfo' is only supported by Firefox
   return typeof browser.runtime.getBrowserInfo !== 'undefined'
}

export function reQueryById(topicId) {
   let url = sysSettings.sys.requeryBaseUrl
   let tabsQueryDef = { active: true, currentWindow: true }
   browser.tabs.query(tabsQueryDef)
   .then(tabs => {
      let tab = tabs[0]
      let codeObj = {}
      if (topicId === 'myfeed') {
         codeObj.code = clickSavedSearchJs("My Feed")
      } else {
         codeObj.code = "window.location.replace('" + url + topicId + "')"
      }
      browser.tabs.executeScript(tab.id, codeObj)
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

export function openAuxilaryWindow (store, url, makeTabActive = true, winOpenParams = "width=460,height=650") {
   // auxWinType = 1: (default) do "window.open", params "width=460,height=650" mimicks ext. popup
   // auxWinType = 2: do "browser.tabs.create"
   let auxWinType = store.state.settings.ui.user.auxilaryWindowType
   if (auxWinType === 1) { 
      let rtnObj = window.open(url, "jcAuxWin", winOpenParams)
   } else {
      browser.tabs.create({ url: url, active: makeTabActive  })
      .catch(err => {utils.logErr(err); });
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

// nix max-width popup hack, used with auxilary tabs/windows
export function removeExtPopupMaxWidth() {
   let el = document.querySelector("body > div")
   if (el) el.removeAttribute("style")

}

export function setPageActionIcon(settings) {

   let manifest = browser.runtime.getManifest();
   let title = manifest.page_action.default_title
   let tabsQueryDef = { active: true, currentWindow: true }

   browser.tabs.query(tabsQueryDef)
   .then( (tabs) => {
      //logMsg({'All Tabs': tabs})
      let tab = tabs[0]
      let canvas = document.createElement('canvas')
      let img = new Image()
      img.src = extActionIcon48  // instead of "/icons/48.png";
      // img.addEventListener('load', function() {}
      img.onload = function () {
         let ctx = canvas.getContext('2d');
         ctx.drawImage(img, 0, 0);                       // add icon to context
         title = updateContext(settings, ctx, title)     // update canvas, return new title
         let imgData =  ctx.getImageData(0, 0, 48, 48)
         
         let setIconParams = {}
         let setTitleParams = {}
         setIconParams = { tabId: tab.id, imageData: imgData }
         browser.pageAction.setIcon(setIconParams)
         .then(() => {
            setTitleParams = { title: title, tabId: tab.id }
            chrome.pageAction.setTitle(setTitleParams)
         })
         .catch(err => { logErr(err); });
      }
   })
   .catch(err => { logErr(err); });
}

// ctx is the canvas context objext
function updateContext(settings, ctx, title) {
   let uiAuto = settings.ui.auto
   if (!uiAuto.isOn) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(42, 6); ctx.lineTo(6, 42);
      // ctx.moveTo(6, 6); // ctx.lineTo(42, 42);
      ctx.stroke();
      title += '\nSwitched Off'
   }
   else if (uiAuto.notificationCount > 0) {
      ctx.font = '56px bold Arial';
      ctx.fillStyle = 'red';
      let textMetrix =  ctx.measureText(uiAuto.notificationCount)
      let textWidth = Math.floor(textMetrix.width) + 1
      let xPos = Math.max(0, Math.floor((48 - textWidth)/2) )
      ctx.fillText(uiAuto.notificationCount, xPos, 44, 48);
      title += '\n' +  uiAuto.notificationCount + ' new notifications'
   }
   return title
   //logMsg('setPageActionIcon fired: ' + uiAuto.notificationCount)
}

export function formatDate(dtIn) {
   let dtMilli = Date.parse(dtIn);
   let dt = new Date(dtMilli);
   let formattedDate = dt.toLocaleString();
   return formattedDate;
}

//logMsg({'deveMode': devMode})