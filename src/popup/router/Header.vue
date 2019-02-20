<template>

   <!--  Main Header -->
   <header>

      <!-- Text title text (centered) -->
      <h2 class="title">jC
         <span class="uw-small">for Upwork</span>
      </h2>

      <!--settings and dev tools img. links (float left) -->
      <span class="tool-links">

         <v-btn
            :onClick="function () {$router.replace({ path: '/settings' })}"
            :iconSrc="settingsIcon"
            :colorClass="'hdr-clr'"
            title="Settings"
         ></v-btn>

         <v-btn
            v-if="devMode"
            :onClick="openToolsWindow"
            :iconSrc="toolsIcon"
            :colorClass="'hdr-clr'"
            title="Dev. Tools"
         ></v-btn>

      </span>

      <!-- chimp img/help link, and version text (float right) -->
      <span class="chimp" @click="openHelpTab" title="Click for help">

         <img :class="{ 'grey-image': !settings.ui.auto.isOn }"
            :src="logo"
            height="55px">

         <p :style="{ color: devColor }">
            ver. {{ version }}
         </p>

      </span>

      <!-- nav row: filte, Notifications Log button, and Main switch -->
      <nav>

         <!--  exact (not used but required if using '/' default path) -->
         <span class="multi" title="filter">
            <router-link class="btn1" to="/all" tag="span" active-class="active">
               All
            </router-link>
            <router-link class="btn1" to="/on" tag="span" active-class="active">
               On
            </router-link>
         </span>

         <span v-if="$route.params.filter" class="count-container">
            <span class="count-container">
                  {{ current.topics.filter.count }}
            </span>
         </span>

         <!-- Button.vue example: icon img only -->
         <!-- <v-btn :onClick="openNotificationsReport"
            :iconSrc="toolsIcon"
            :colorClass="'hdr-clr'"
         ></v-btn> -->

         <v-btn :onClick="openNotificationsReport"
            :iconSrc="reportsIcon"
            :colorClass="'hdr-clr'"
            style="margin-left: 16px"
         >
            Notifications Log
         </v-btn>

         <!-- Button.vue example: button text only -->
         <!-- <v-btn :onClick="openNotificationsReport">
            No Img
         </v-btn> -->

         <toggle-switch title="Main switch" class="main-switch"
            v-model="settings.ui.auto.isOn"
            @input="toggleIsOnAndPersist($event)"
         ></toggle-switch>
         
      </nav>

   </header>
</template>

<script>
   import reportsIcon from "@/assets/reports.png"
   import wrenchIcon from "@/assets/wrench.png"
   import gearsIcon from "@/assets/gears.png"
   import chimp128 from "../../shared/chimp128.js";
   import * as utils from "../../shared/utils.js";
   import ToggleSwitch from "./pages/sub/ToggleSwitch.vue";
   import Button from "./pages/sub/Button.vue";
   export default {
      data () { 
         return {
            filter: { name: '', count: ''},
            'logo': chimp128,
            reportsIcon: reportsIcon,
            toolsIcon: wrenchIcon,
            settingsIcon: gearsIcon
          };
      },
      watch: {
         '$route': function(to, from) {
            if (to.params && to.params.filter) {
               this.settings.ui.auto.topicsFilter = to.params.filter
               let self = this
               this.persistSettings()
            }
         }
      },
      mounted () {
         if (this.settings.ui.auto.notificationCount > 0) {
            if (this.settings.ui.user.autoPopupNewNotifications) {
               this.openNotificationsReport()
            }
         }
      },
      methods: {
         testSetIcon() { },
         toggleIsOnAndPersist(event) {
            this.settings.ui.auto.isOn = event
            let self = this
            this.persistSettings(function () {
               utils.syncAlarmToMainSwitch(self.settings);
               utils.setPageActionIcon(self.settings)
            })
         },
         persistSettings(callback) {
            this.$store.dispatch("persistToStorage", "settings")
            .then(() => {
               if (typeof callback === 'function') callback()
            })
            .catch(err => { utils.logErr(err);});
         },
         openHelpTab() {
            let url = browser.runtime.getManifest().homepage_url;
            browser.tabs
               .create({ active: true, url: url })
               .catch(err => {
                  utils.logErr(err);
               });
         },
         openNotificationsReport() {
            let aux = new utils.AuxWindow({
               url: "../popup/popup.html?p=reports&report=notifications",
               name : 'notifications'
            })
            utils.openAuxilaryWindow(this.$store, aux)
            this.zeroNotificationCount()
         },
         zeroNotificationCount() {
            this.settings.ui.auto.notificationCount = 0
            let self = this
            this.persistSettings( function () {
               utils.setPageActionIcon(self.settings)
            })
         },
         openToolsWindow() {
             let aux = new utils.AuxWindow({
               url: "../popup/popup.html?p=tools",
               name : 'tools'
             })
             utils.openAuxilaryWindow(this.$store, aux)
         }
      },
      computed: {
         current () {
            return this.$store.getters.current;
         },
         settings () {
            return this.$store.getters.settings
         },
         version () {
            let manifest = browser.runtime.getManifest()
            return manifest.version
         },
         devMode () {
            return utils.devMode
         },
         devColor () {
            if (this.devMode) return 'red' }
      },
      components: {
         "toggle-switch": ToggleSwitch,
         "v-btn": Button
      }
   };
</script>

<style scoped>
   header {
      height: 84px;
   }
   .tool-links  {
      position: absolute;
      height: 36px;
      padding-left: 10px;
      top: 0;
      left: 0;
   }
   .chimp {
      padding: 6px;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 75%;
   }
   .chimp:hover {
      cursor: hand;
      cursor: pointer;
   }
   .chimp > p {
      margin: 0;
      line-height: 6px;
   }
   .uw-small {
      color: rgb(55, 160, 0);
      font-size: 75%;
      font-style: italic;
   }
   .grey-image {
      filter: grayscale(100%);
   }
    .main-switch {
      margin: 0 0 0 14px;
   }
   nav {
      box-sizing: border-box;
      position: relative;
      height: 40px;
      padding: 6px 6px 6px 10px;
      background-color: rgba(32, 31, 25, 0.068);
   }
   .multi {
      position: relative;
   }
   .btn1 {
      background-color: rgb(221, 209, 192);
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 28px;
      line-height: 22px;
      padding: 3px 4px 3px 4px;
      border-radius: 0;
      text-align: center;
      vertical-align: middle;
   }
   .btn1:hover,
   .btn1.active,
   .btn1.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }
   .multi > .btn1:first-child {
      border-radius: 5px 0 0 5px
   }
   .multi > .btn1:last-child {
      border-radius: 0 5px 5px 0
   }
   .count-container {
      display: inline-block;
      overflow: hidden;
      width: 26px;
      margin: 0 6px 0 4px;
      text-align: left;
      vertical-align: text-bottom;
      color: rgb(55, 160, 0);
      font-weight: 650;
      font-size: 13px;
   }
   .count-container > span {
      margin: 0;
   }
</style>