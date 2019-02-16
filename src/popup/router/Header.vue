<template>

   <!--  Main Header -->
   <header>

      <!-- Text title text (centered) -->
      <h2 class="title">jC
         <span class="uw-small">for Upwork</span>
      </h2>

      <!--settings and dev tools img. links (float left) -->
      <span class="tool-links">
         <img @click="$router.replace({ path: '/settings' })"
            class="nav-icon"
            title="Settings"
            src="../../assets/gears.png">
         <img v-if="devMode"
            class="nav-icon"
            @click="openToolsWindow()"
            title="Dev. Tools"
            src="../../assets/wrench.png">         
      </span>

      <!-- chimp img/help link, and version text (float right) -->
      <span class="chimp" @click="openHelpTab" title="Click for help">
         <img :class="{ 'grey-image': !settings.ui.auto.isOn }"
            src="../../assets/128.png"
            height="55px"
         >
         <p>
            ver. {{ version }}
            <span v-if="devMode" style="color: red;"> dev</span>
         </p>
      </span>

      <nav>
         <div>
            <!--  exact   (required when detecting default path of just '/') -->
            <span class="multi">
               <router-link class="btn1" to="/all" tag="span" active-class="active">
                  All
               </router-link>
               <router-link class="btn1" to="/on" tag="span" active-class="active">
                  On
               </router-link>
               <router-link class="btn1" to="/off" tag="span" active-class="active">
                  Off
               </router-link>
            </span>

            <!-- <span v-if="$route.params.filter" class="count-container"> -->
            <span class="count-container">
                  {{ current.topics.filter.count }}
            </span>

            <!-- Reports button testing -->
            <!-- <router-link title="Reports - normal route" to="/reports" tag="button" active-class="active">
               Rn
            </router-link> -->

            <img @click="openNotificationsReport()"
                  class="nav-icon"
                  title="Notification History" src="../../assets/reports.png">     

            <toggle-switch title="Main switch" class="nav-switch"
               v-model="settings.ui.auto.isOn"
               @input="toggleIsOnAndPersist($event)"
            ></toggle-switch>

         </div>
      </nav>

   </header>
</template>

<script>
   import * as utils from "../../shared/utils.js";
   import ToggleSwitch from "./pages/sub/ToggleSwitch.vue";
   export default {
      data () { 
         return {
            filter: { name: '', count: ''}
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
            let url = "../popup/popup.html?p=reports&report=notifications";
            utils.openAuxilaryWindow(this.$store, url)
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
             let url = "../popup/popup.html?p=tools";
             let type = this.settings.ui.user.auxilaryWindowType
             utils.openAuxilaryWindow(this.$store, url, type)
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
         }
      },
      components: {
         "toggle-switch": ToggleSwitch
      }
   };
</script>

<style scoped>
   header {
      height: 84px;
   }
   span.tool-links  {
      padding: 0;
      position: absolute;
      top: 0;
      left: 0;
   }
   /* span.tool-links > img {
      width: 25px;
      margin: 5px 5px 0 5px
   } */
   span.chimp {
      padding: 6px;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 75%;
   }
   span.chimp:hover {
      cursor: hand;
      cursor: pointer;
   }
   span.chimp > p {
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
   .nav-switch {
      display: inline-block;
      margin: 0 0 0 14px;
      vertical-align: text-bottom;
   }   
   nav {
      position: relative;
      height: 40px;
      background-color: rgba(32, 31, 25, 0.068);
   }
   nav > div {
      margin: 0;
      padding-left: 10px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
   }
   .btn1 {
      background-color: rgb(221, 209, 192);
   }
   .btn1:hover,
   .btn1.active,
   .btn1.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }
   /* .multi {
      margin: 0 7px 0 14px ;
   } */
   .multi > .btn1 {
      width: 40px;
      /* margin: 0 0; */
      padding: 4px 10px;
      border-radius: 0
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
      width: 30px;
      margin: 0 14px;
      /* vertical-align: text-bottom */
      color: rgb(55, 160, 0);
      font-weight: 650;
      font-size: 13px;
   }
   /* .count-container > span {
      color: rgb(55, 160, 0);
      font-weight: 650;
      font-size: 13px;
   } */
</style>