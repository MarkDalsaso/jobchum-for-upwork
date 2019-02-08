<template>
   <div class="panel">
      <h4>Misc. Dev. Tools and Functions</h4>
      <div>
         <span class="btn1" @click="dumpStorage()">S. ALL</span>
         <span class="btn1" @click="dumpStorage('settings')">St. Settings</span>
         <span class="btn1" @click="dumpStorage('topics')">St. Topics</span>
         <span class="btn1" @click="reloadFindWorkPage()">reload if no topics</span>
         <br>
         <span class="btn1" @click="clearTopics()">Delete Topics</span>
         <span class="btn1" @click="initState()">Init. State</span>
         <span class="btn1" @click="clearExtensionState()">DELETE ALL State</span>
         <br>
         <span class="btn1" @click="addMainAlarm()">Add Main Alarm</span>
         <span class="btn1" @click="openReportsWindow()">Open Reports Window</span>
         <span class="btn1" @click="openReportsTab()">Open Reports Tab</span>
      </div>
      <div>
         <textarea wrap="off" v-model="jsonDump" class="jsonTextarea" spellcheck="false"
         ></textarea>
         <!-- <textarea v-model="jsonDump" ></textarea> -->
         <!-- <pre class="json">{{ jsonDump }}</pre> -->
      </div>
   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   import sysSettings from "../../../shared/settings.json";
   export default {
      data() {
         return {
            jsonDump: {}
         };
      },
      created() {
         this.initState();
      },
      mounted() {
         this.dumpStorage("topics");
      },
      methods: {
         addMainAlarm() {
            let alarm = this.settings.sys.mainAlarm;
            browser.alarms.create(alarm.name, alarm.info);
         },
         dumpStorage(key = null) {
            browser.storage.local.get(key).then(results => {
               if (key) {
                  this.jsonDump = JSON.stringify(results[key], null, 2);
               } else {
                  this.jsonDump = JSON.stringify(results, null, 2);
               }
            });
         },
         initState() {
            this.$store.dispatch("initState");
         },
         clearTopics () {
            this.$store.dispatch('fetchFromStorage', 'topics')
            .then ( () => { 
               this.$store.commit('topics', []);
               this.$store.dispatch('persistToStorage', 'topics')
               .catch(err => { utils.logErr(err); });
            })
            .catch(err => { utils.logErr(err); });
         },
         clearExtensionState() {
            this.$store.dispatch("wipeExtensionState");
         },
         reloadFindWorkPage() {
            let self = this
            this.$store.dispatch("fetchFromStorage", "topics").then(function () {
               if (self.topics.length == 0) {
                  const code =
                     "window.location.replace('" +
                     sysSettings.sys.requeryBaseUrl +
                     "')";
                  browser.tabs.executeScript(null, { code: code });
               }
            });
         },
         openReportsWindow: function(event) {
            window.open("./reports.html", "reportswindow", "width=425,height=650")
         },
         openReportsTab: function(event) {
            let url
            url = "./popup/reports.html?t1=boo&t2=ya-man";
            //url = "./popup/popup.html#/settings";
            browser.tabs
               .create({ active: true, url: url })
               .catch(err => {
                  utils.logErr(err);
            });
         }
      },
      computed: {
         topics() {
            return this.$store.getters.topics;
         },
         settings() {
            return this.$store.getters.settings;
         }
      }
   };
</script>

<style scoped>
   .panel {
     margin-top: 84px; 
   }
   .btn1 {
      background-color: rgb(221, 209, 192);
      margin: 3px 7px;
      padding: 4px 6px;
   }
   .btn1:hover {
      background-color: rgb(255, 237, 209);
   }
   .jsonTextarea {
      box-sizing: border-box;
      border: none;
      width: 96%;
      height: 735px;
      background-color: rgb(248, 248, 213);
      margin: 8px 3px 8px 3px;
      padding: 3px;
      overflow: auto;
   }
   h4 {
      text-align: center;
      margin: 0
   }  
</style>
