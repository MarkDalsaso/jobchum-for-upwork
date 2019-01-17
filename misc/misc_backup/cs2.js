console.log('cs2.js Load START');

// An example that:
//   * uses the following manifest.json config for after doc loads
//   * also, insert button and event handler, (see: addSimpleButtonAndClickEvent())
/*
   "content_scripts": [
      {
         "matches": [" "],
         "js": ["content_scripts/cs2.js"],
         "run_at": "document_end"
      },
   "web_accessible_resources": ["content_scripts/atDocEndInjection.js"]
*/

var injection = document.createElement('script');
injection.src = chrome.runtime.getURL('content_scripts/atDocEndInjection.js');
(document.head || document.documentElement).appendChild(injection);
injection.onload = function() {
   injection.parentNode.removeChild(injection);
};

// addSimpleButtonAndClickEvent();
// let topics = getTopicsFromDom();
// console.log(topics);

// window.addEventListener(
//    'message',
//    function persistRawXhrData(event) {
//       if (event.source != window) return;
//       var msgData = event.data;
//       console.log(msgData);
//       // chrome.runtime.sendMessage(msgData, function(response) {
//       //    console.log(msgData);
//       // });
//    },
//    false
// );

// on window load add test button
window.addEventListener('load', function() {
   addSimpleButtonAndClickEvent();
   let topics = getTopicsFromDom();
   console.log(topics);
});

function getTopicsFromDom() {
   //const topicSelector = "[data-topic-list=''] > ul > li:not([data-ng-repeat]";
   const topicSelector = "[data-topic-list=''] > ul > li";
   var topicNodes = document.querySelectorAll(topicSelector);
   var topics = [];
   for (let i = 0; i < topicNodes.length; i++) {
      topics.push(topicNodes[i]);
   }
   return topics;
}

// Here's how to add a simple button with event listener 'sendMsg'
function addSimpleButtonAndClickEvent() {
   var elem = document.createElement('button');
   elem.style.cssText = 'position:fixed; bottom: 5px; left: 5px; color: black';
   elem.textContent = 'Click to Send test msg';
   elem.id = 'myTestButton';
   document.body.appendChild(elem);
   var btn = document.getElementById('myTestButton');
   btn.addEventListener('click', sendMsg);
}

function sendMsg(eventObj) {
   console.log(eventObj);
   // chrome.runtime.sendMessage(eventObj, function(response) {
   //    console.log(eventObj);
   // });
}
