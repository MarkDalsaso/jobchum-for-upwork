/* Utility functions
         Usage import named exports individually:
   import { supportsBrowserNamespace, extManifest } from 'utils.js'
         or ...
   import * as utils from 'utils.js'
*/

//returns true if the current browser intrinsically supports the 'browser' object/namespace
export const supportsBrowserNamespace = !(
   typeof browser === 'undefined' ||
   Object.getPrototypeOf(browser) !== Object.prototype
);

// return the extension's manifest
export function getManifest() {
   if (supportsBrowserNamespace) {
      return browser.runtime.getManifest();
   } else if (chrome) {
      return chrome.runtime.getManifest();
   }
}

export function logMsg(msg) {
   let m = msg instanceof Object ? msg : { 'msg': msg }
   console.log(m);
}

export function logErr(err) {
   let m = err instanceof Object ? err : { 'err': err }
   console.log(m);
}
