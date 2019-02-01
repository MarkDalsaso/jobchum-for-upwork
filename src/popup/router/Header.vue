<template>

   <!--  Main Header -->
   <header>

      <!-- gear img/settings link (float left) -->
      <img class="gear"
         @click="$router.replace({ path: '/settings' })"
         title="Settings"
         src="../../assets/gear1.png"
      >

      <!-- Text title text (centered) -->
      <h2 class="title">jobMonkey
         <span class="smaller">for Upwork</span>
      </h2>

      <!-- monkey img/help link, and version text (float right) -->
      <span class="monkey" @click="openHelpTab" title="Click for help">
         <img :class="{ 'grey-image': !settings.jmUi.isOn }"
            src="../../assets/jm128.png"
            height="55px"
         >
         <p>
            ver. {{ version }}
            <span v-if="devMode" style="color: red;">(dev)</span>
         </p>
      </span>

      <!-- nav buttons: 'Topics', 'Filter', 'Tools' and 'Main switch' -->
      <nav>
         <div>
            <router-link class="btn1" to="/all" tag="span" active-class="active" exact>
               All
            </router-link>

            <router-link class="btn1" to="/on" tag="span" active-class="active">
               On
            </router-link>

            <router-link class="btn1" to="/off" tag="span" active-class="active">
               Off
            </router-link>

            <router-link class="btn1" to="/tools" tag="span" active-class="active">
               Tools
            </router-link>

            <toggle-switch title="Main switch" style="float:right; margin: 0 0 0 14px;"
               :value="this.settings.jmUi.isOn"
               @input="toggleIsOnAndPersist($event)"
            ></toggle-switch>

         </div>
      </nav>

   </header>
</template>

<script>
   import * as utils from "../../shared/utils.js";
   import ToggleSwitch from "./pages/ToggleSwitch.vue";
   export default {
      data () {
         return { 
         };
      },
      watch: {
         '$route': function(to, from) {
            if (to.params && to.params.filter) {
               this.settings.jmUi.topicsFilter = to.params.filter
               this.persistSettings(function () {
                  utils.logMsg(to.params.filter)
               })               
            }
         }
      },
      methods: {
         toggleIsOnAndPersist(event) {
            this.settings.jmUi.isOn = event
            let self = this
            this.persistSettings(function () {
               utils.syncAlarmToMainSwitch(self.settings);
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
            let manifest = browser.runtime.getManifest();
            browser.tabs
               .create({ active: true, url: manifest.homepage_url })
               .catch(err => {
                  utils.logErr(err);
               });
         }
      },
      computed: {
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
      z-index: 100;
      height: 84px;
      position: fixed;
      top: 0;
      width: 100%;
      overflow: hidden;
      background: rgb(246, 232, 181);
      /* border: solid 1px rgb(141, 141, 141); */
   }

   h2.title {
      padding-right: 15px;
      text-align: center;
      margin: 0 0 5px 0;
   }

   img.gear {
      padding: 8px;
      float: left;
      max-width: 100%;
      height: auto;
   }

   header > span.monkey {
      padding: 6px;
      z-index: 10;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 75%;
   }

   header > span.monkey:hover {
      cursor: hand;
      cursor: pointer;
   }

   header > span > p {
      margin: 0;
      line-height: 6px;
   }

   .smaller {
      color: rgb(55, 160, 0);
      font-size: 75%;
      font-style: italic;
   }

   .grey-image {
      filter: grayscale(100%);
   }

   nav {
      position: relative;
      height: 40px;
      background-color: rgba(32, 31, 25, 0.068);
   }

   nav > div {
      margin: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
   }

   .btn1.filter {
      width: 70px;
   }

   nav > div > .btn1 {
      color: black;
      margin: 0 14px;
      background-color: rgb(221, 209, 192);
      /* border: solid 1px rgb(222, 222, 222); */
   }

   nav > div .btn1:hover,
   nav > div .btn1.active,
   nav > div .btn1.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }
</style>