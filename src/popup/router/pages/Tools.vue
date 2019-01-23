<template>
   <div class="panel">
      <div>
         <button class="btn1" @click="dumpStorage()">S. ALL</button>
         <button class="btn1" @click="dumpStorage('settings')">St. Settings</button>
         <button class="btn1" @click="dumpStorage('topics')">St. Topics</button>
         <button class="btn1" @click="reloadFindWorkPage()">reload if no topics</button>
         <br>
         <button class="btn1" @click="initState()">Init. State</button>
         <button class="btn1" @click="clearExtensionState()">DELETE ALL State</button>
         <br>
         <button class="btn1" @click="addMainAlarm()">Add Main Alarm</button>
      </div>
      <div>
         <textarea
            wrap="off"
            v-model="jsonDump"
            class="jsonTextarea"
            spellcheck="false"
         ></textarea>
         <!-- <textarea v-model="jsonDump" ></textarea> -->
         <!-- <pre class="json">{{ jsonDump }}</pre> -->
      </div>
   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   import jmSettings from "../../../shared/settings.json";
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
            let alarm = this.settings.mainAlarm;
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
         clearExtensionState() {
            this.$store.dispatch("wipeExtensionState");
         },
         reloadFindWorkPage() {
            this.$store.dispatch("fetchFromStorage", "topics").then(topics => {
               if (topics.length == 0) {
                  const code =
                     "window.location.replace('" +
                     jmSettings.requeryBaseUrl +
                     "')";
                  browser.tabs.executeScript(null, { code: code });
               }
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
   .panel > div > button.btn1 {
      margin: 3px 14px;
   }
   .json {
      background-color: #eeece0;
      font-size: 14px;
   }
   button.btn1 {
      margin-right: 10px;
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
</style>
