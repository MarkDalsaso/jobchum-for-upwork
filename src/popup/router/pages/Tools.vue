<template>
   <div class="panel">
      <usage-bar :value="22"></usage-bar>
      <div>
         <h4>Ext. Local Storage Dumps</h4>
         <v-btn :onClick="function () {dumpStorage()}" :colorClass="'hdr-clr'">Stg. ALL</v-btn>
         <v-btn :onClick="function () {dumpStorage('settings')}" :colorClass="'hdr-clr'">Stg. Settings</v-btn>
         <v-btn :onClick="function () {dumpStorage('topics')}" :colorClass="'hdr-clr'">Stg. Topics</v-btn>
         <v-btn :onClick="function () {dumpStorage('notifications')}" :colorClass="'hdr-clr'">Stg. Notifications</v-btn>

         <h4>Vuex State Dumps</h4>
         <v-btn :onClick="dumpAllVuexState" :colorClass="'hdr-clr'">Vx. St. ALL</v-btn>
         <v-btn :onClick="dumpCurrentNodeVuexState" :colorClass="'hdr-clr'">Vx. St. Current Node</v-btn>
         <v-btn :onClick="dumpNotificationsNodeVuexState" :colorClass="'hdr-clr'">Vx. St. Notifications Node</v-btn>

         <h4>Misc. Reset and Initialize</h4>
         <v-btn :onClick="emptyTopicsArray" :colorClass="'hdr-clr'">Empty Topics Array</v-btn>
         <v-btn :onClick="emptyNotificationsArray" :colorClass="'hdr-clr'">Empty Notifications Array</v-btn>
         <v-btn :onClick="loadStateFromStorage" :colorClass="'hdr-clr'">Reload State From Storage</v-btn>
         <v-btn :onClick="wipeExtensionState" :colorClass="'hdr-clr'">DELETE ALL Storage/State</v-btn>

         <h4>Misc</h4>
         <v-btn :onClick="openReports" :colorClass="'hdr-clr'">Open Notifications Reports</v-btn>
         <v-btn :onClick="addMainAlarm" :colorClass="'hdr-clr'">Add Main Alarm</v-btn>

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
   import Button from "./sub/Button.vue";
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
            let aux = new utils.AuxWindow({
               url: "../popup/popup.html?p=reports&report=notifications",
               name : 'notifications'
            })
            utils.openAuxilaryWindow(this.$store, aux)
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
         'usage-bar': UsageBar,
         'v-btn': Button
      }
   };
</script>

<style scoped>
   .panel {
     margin: 0 15px;
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
      margin: 5px 0 15px 0
   }  
</style>
