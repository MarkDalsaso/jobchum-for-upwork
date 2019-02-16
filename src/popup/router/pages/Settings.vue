<template>
   <div class="panel">

      <h4>Settings</h4>
      <section class="grid">

         <div>
            <toggle-switch
               v-model="settings.ui.user.playSound"
               @input="persist()"
             ></toggle-switch>
            <label>Play sound on notification of results</label>             
         </div>

         <div>
            <toggle-switch
               v-model="settings.ui.user.autoPopupNewNotifications"
               @input="persist()"
             ></toggle-switch>
            <label>Automatically popup notification history log when new notifications are detected</label>             
         </div>

         <div>
            <toggle-switch
               v-model="settings.ui.user.domesticTopic"
               @input="persist()"
             ></toggle-switch>
            <label>Include 'Domestic', ( 'U.S. Only' for example) as query topic</label>
         </div>

         <div>
            <toggle-switch
               v-model="settings.ui.user.myFeedTopic"
               @input="persist()"
             ></toggle-switch>
            <label>Include 'My Feed' as query topic</label>
         </div>

         <div>
            <input class="btn1" type="number" min="1" max="2"
                  v-model.number="settings.ui.user.auxilaryWindowType"
                  @change="persist()"
               >
            <label>Auxiliary window type (e.g. reports)<br>1 for 'window',<br>2 for 'tab'</label>
         </div>
      
      </section>
      
      <h4 @click="getStorageStats()">Data Usage</h4>
      <section>
         <div>
            <usage-bar :value="percentOfQuota"></usage-bar>
            <div>
               {{ percentOfQuota + '%' }} ({{totalBytesInUse}} bytes) of 5GB standard quoto.
            </div>
         </div>
      </section>
      <section class="grid">
         <div>
            <span @click="emptyNotificationsArray()" class=btn1>Clear</span>
            <label>Clear Notification History ({{notificationsBytes}} bytes)</label>
         </div>
      </section>

   </div>
</template>

<script>
   const QUOTA_BYTES = 5242880    // 5 Gigabytes (GB)
   import * as utils from "../../../shared/utils";
   import ToggleSwitch from "./sub/ToggleSwitch.vue";
   import UsageBar from "./sub/UsageBar.vue";   
   export default {
      data () {
         return {
            storageStats: [],
            totalBytesInUse: 0,
            percentOfQuota: 0,
            notificationsBytes: 0
         }
      },
      mounted () {
         this.getStorageStats()
         let self = this
         browser.storage.onChanged.addListener( () => {
            self.getStorageStats()
         })
      },
      methods: {
         getStorageStats () {
            let self = this
            browser.storage.local.getBytesInUse(null)
            .then( (bytes) => {
               self.totalBytesInUse = bytes * 2   //char is UTF-16 (2 bytes)
               self.percentOfQuota = self.percentUsed(bytes, QUOTA_BYTES)
               browser.storage.local.getBytesInUse('notifications')
               .then ( (bytes) => { this.notificationsBytes = bytes })
            })
            .catch(err => { utils.logErr(err);});
         },
         percentUsed (piece, pie) {
            // get the % of the piece of the overall pie (rounded to 2 dec's)
            let percent = (piece / pie) * 100
            return Math.round(percent * 100) / 100
         },         
         bytesTo () {},
         emptyNotificationsArray () {
            this.$store.commit('notifications', []);
            this.$store.dispatch('persistToStorage', 'notifications')
            .catch(err => { utils.logErr(err); });
         },         
         persist (callback) {
            this.$store.dispatch("persistToStorage", "settings")
            .then(() => {
               if (typeof callback === 'function') callback()
            })
            .catch(err => { utils.logErr(err);});
         }
      },
      computed: {
         settings() {
            return this.$store.getters.settings
         },
         settingsJson() {
            return JSON.stringify(this.settings, null, 2)
         },
         devMode () {
            return utils.devMode
         }         
      },
      components: {
         "toggle-switch": ToggleSwitch,
         'usage-bar': UsageBar
      }      
   }
</script>

<style scoped>
   .panel {
     margin-top: 84px; 
   }
   .grid div {
      display: grid;
      grid-template-columns: 1fr 6fr;
      align-items: center;
   }
   section > div {
      margin: 6px;
      padding: 4px;
      border-radius: 3px;
      background-color: rgb(181, 206, 246);
   }
   section > div > div:nth-child(1) {
      justify-self: center
   }
   section > div > :nth-child(2) {
      padding-left: 5px
   }   
   h4 {
      margin: 10px 0 0 0 ;
      text-align: center;
   }
   .btn1 {
      color: black;
      background-color: rgba(235, 239, 245, 0.5);
      display: inline-block;
      font-weight: 650;
      font-size:  13px;
      font-family: inherit;
      border-radius: 5px;
      outline: none;
      box-sizing: border-box;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
      padding: 4px 10px;
   }
   .btn1:hover,
   .btn1:active,
   .btn1:hover > input[type] {
      background-color: rgba(231, 235, 240, 0.87);
      cursor: hand;
      cursor: pointer;
      border-radius: 5px;
      outline: none;
   }
   .btn1 > label:hover {
      cursor: hand;
      cursor: pointer;
   } 
   input.btn1[type="number"] {
      width: 40px;
      height: 30px;
      margin: 0 0 0 4px;
      padding: 3px;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25);
   }
</style>
