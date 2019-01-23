<template>
   <section class="topic-blue">
      <table class="topics-table">
         <tr>
            <td>
               <button
                  class="topic-name btn1"
                  v-on:click="invokeSavedSearch"
               >{{ topic.captured.name }}</button>
            </td>
            <td class="enable-btn-col">
               <button class="btn1">
                  <label v-bind:for="'enabled-checkbox_'+index">Enabled</label>
                  <input
                     type="checkbox"
                     v-bind:id="'enabled-checkbox_'+index"
                     v-model="topic.custom.enabled"
                     v-on:change="rowChg(topic)"
                  >
               </button>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <label>Query interval</label>
               <input
                  type="number"
                  class="btn1 interval"
                  v-model.number="topic.custom.qInterval"
                  v-on:change="rowChg(topic)"
                  placeholder="minutes"
               > (minutes)
            </td>
         </tr>
         <tr>
            <td colspan="2">
               Last query: {{ lastQuery(topic.custom.qLastRequest) }}
               &nbsp; &nbsp; &nbsp;
               Next query: {{ nextQuery(topic.custom.qLastRequest, topic.custom.qInterval) }}
            </td>
         </tr>

         <!--  "more info" expand/collapse
            <tr>
                <td colspan=2>
                    filters: {{ topic.captured.q }}
                </td>
            </tr>             
         "more info" expand/collapse-->
      </table>
   </section>
</template>

<script>
export default {
  props: ["topic", "index"],
  methods: {
    rowChg: function(topic) {
      var key = topic.id;
      var obj = {};
      obj[key] = topic;
      //chrome.storage.local.set(obj);
    },
    invokeSavedSearch: function(evt) {
      // Unvoke saved search (ss)
      var ssName = evt.currentTarget.textContent.trim();

      //var ssCode = snippets.clickSavedSearchJs(ssName);
      /*
      chrome.tabs.executeScript(
        null, // null means active tab
        { code: ssCode },
        //{ file: "js/testExeScript.js" },
        function onExeResults(results) {
          if (chrome.runtime.lastError) {
            console.log(
              "Error in 'chrome.tabs.executeScript': " +
                chrome.runtime.lastError.message
            );
          }
        }
      );
      */
    },
    lastQuery: function(dateInt) {
      return formatDateTime(dateInt);
    },
    nextQuery: function(dateInt, interval) {
      // convert minute-based interval to milliseconds
      if (!dateInt) return "";
      var nextQryInt = dateInt + interval * 60 * 1000;
      if (nextQryInt < Date.now()) return "overdue";
      else return formatDateTime(nextQryInt);
    }
  }
};

function formatDateTime(dateInt) {
  if (!dateInt) return "";
  var date = new Date(dateInt);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  var strDate = "";
  // Following commented-out code left in for future date options and refinements
  //strDate = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
  //strDate = date.getMonth()+1 + "/" + date.getDate() + "/";
  return strDate + " " + strTime;
}
</script>

<style scoped>
   .topic-blue {
      background-color: rgb(181, 206, 246);
   }

   .topics-table td {
      padding: 2px;
      overflow: hidden;
      white-space: nowrap;
      /* border: 1px solid black; */
   }

   .topics-table td.enable-btn-col {
      width: 22%;
      text-align: right;
   }

   .topic-name {
      font-weight: bold;
   }

   .topic-options {
      line-height: 1.2em;
   }

   .topics-table .interval {
      width: 65px;
      margin-left: 3px;
   }
</style>