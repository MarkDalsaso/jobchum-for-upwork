// Utility to track nuances in browser specific support for the web extension API

//returns true if the current browser intrinsically supports the 'browser' object/namespace
const supportsBrowserNamespace = !(
   typeof browser === 'undefined' ||
   Object.getPrototypeOf(browser) !== Object.prototype
);

function extManifest() {
   if (supportsBrowserNamespace) {
      return browser.runtime.getManifest();
   } else if (chrome) {
      return chrome.runtime.getManifest();
   }
}

export default {
      supportsBrowserNamespace,
      extManifest
   };