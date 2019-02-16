<template>
   <div class="panel">
      <usage-bar :value="22"></usage-bar>
      <div>
         <h4>Ext. Local Storage Dumps</h4>
         <span class="btn1" @click="dumpStorage()">Stg. ALL</span>
         <span class="btn1" @click="dumpStorage('settings')">Stg. Settings</span>
         <span class="btn1" @click="dumpStorage('topics')">Stg. Topics</span>
         <span class="btn1" @click="dumpStorage('notifications')">Stg. Notifications</span>
         <h4>Vuex State Dumps</h4>
         <span class="btn1" @click="dumpAllVuexState()">Vx. St. ALL</span>
         <span class="btn1" @click="dumpCurrentNodeVuexState()">Vx. St. Current Node</span>
         <span class="btn1" @click="dumpNotificationsNodeVuexState()">Vx. St. Notifications Node</span>
         <h4>Misc. Reset and Initialize</h4>
         <span class="btn1" @click="emptyTopicsArray()">Empty Topics Array</span>
         <span class="btn1" @click="emptyNotificationsArray()">Empty Notifications Array</span>
         <span class="btn1" @click="loadStateFromStorage()">Reload State From Storage</span>
         <span class="btn1" @click="wipeExtensionState()">DELETE ALL Storage/State</span>
         <h4>Misc</h4>
         <span class="btn1" @click="openReports()">Open Reports Tab</span>
         <span class="btn1" @click="addMainAlarm()">Add Main Alarm</span>
      </div>
      <div>
         <textarea wrap="off" v-model="jsonDump" class="jsonTextarea" spellcheck="false"></textarea>
      </div>
   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   // import sysSettings from "../../../shared/settings.json";
   import UsageBar from "./sub/UsageBar.vue";
   export default {
      data () {
         return {
            jsonDump: ''
         };
      },
      mounted () { utils.removeExtPopupMaxWidth() },
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
         dumpAllVuexState() {
            this.jsonDump = JSON.stringify(this.$store.state, null, 2);
         },
         dumpCurrentNodeVuexState() {
            this.jsonDump = JSON.stringify(this.$store.state.current, null, 2);
         },
         dumpNotificationsNodeVuexState() {
            this.jsonDump = JSON.stringify(this.$store.state.notifications, null, 2);
         },
         loadStateFromStorage() {
            this.$store.dispatch("loadStateFromStorage");
         },
         emptyTopicsArray () {
            this.$store.dispatch('fetchFromStorage', 'topics')
            .then ( () => { 
               this.$store.commit('topics', []);
               this.$store.dispatch('persistToStorage', 'topics')
               .catch(err => { utils.logErr(err); });
            })
            .catch(err => { utils.logErr(err); });
         },
         emptyNotificationsArray () {
            this.$store.dispatch('fetchFromStorage', 'notifications')
            .then ( () => { 
               this.$store.commit('notifications', []);
               this.$store.dispatch('persistToStorage', 'notifications')
               .catch(err => { utils.logErr(err); });
            })
            .catch(err => { utils.logErr(err); });
         },         
         wipeExtensionState() {
            this.$store.dispatch("wipeExtensionState");
         },
         openReports() {
            let rtnObj = null
            let url = "../popup/popup.html?p=reports&report=notifications"
            utils.openAuxilaryWindow(this.$store, url, false)
         },
      },
      computed: {
         topics() {
            return this.$store.getters.topics;
         },
         settings() {
            return this.$store.getters.settings;
         }
      },
      components: {
         'usage-bar': UsageBar
      }
   };
</script>

<style scoped>
   .panel {
     margin-top: 0;
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
