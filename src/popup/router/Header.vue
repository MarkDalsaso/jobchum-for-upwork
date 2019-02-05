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
      <h2 class="title">jobChimp
         <span class="smaller">for Upwork</span>
      </h2>

      <!-- chinp img/help link, and version text (float right) -->
      <span class="chimp" @click="openHelpTab" title="Click for help">
         <img :class="{ 'grey-image': !settings.ui.auto.isOn }"
            src="../../assets/jm128.png"
            height="55px"
         >
         <p>
            ver. {{ version }}
            <span v-if="devMode" style="color: red;"> dev</span>
         </p>
      </span>

      <nav>
         <div>
            <!--  exact   (required when detectin default path of just '/') -->
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

            <span class="count-container">
               <span v-if="$route.params.filter">{{ current.topics.filter.count }}</span>
            </span>

            <router-link class="btn1" to="/tools" tag="span" active-class="active">
               Tools
            </router-link>

            <toggle-switch title="Main switch" style="float:right; margin: 0 0 0 14px;"
               v-model="settings.ui.auto.isOn"
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
            filter: { name: '', count: ''}
          };
      },
      mounted() {
         // Activate route filter param from saved state
         this.$router.replace({ path: '/' + this.settings.ui.auto.topicsFilter })
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
      methods: {
         toggleIsOnAndPersist(event) {
            this.settings.ui.auto.isOn = event
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

   header > span.chimp {
      padding: 6px;
      z-index: 10;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 75%;
   }

   header > span.chimp:hover {
      cursor: hand;
      cursor: pointer;
   }

   header > span.chimp > p {
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

   .btn1 {
      color: black;
      margin: 0 14px;
      background-color: rgb(221, 209, 192);
   }

   .btn1:hover,
   .btn1.active,
   .btn1.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }

   .multi {
      margin: 0 7px 0 14px ;
   }

   .multi > .btn1 {
      width: 40px;
      margin: 0 0;
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
      margin-right: 14px;
      vertical-align: text-bottom
   }

   .count-container > span {
      color: rgb(55, 160, 0);
      font-weight: 650;
      font-size: 13px;
   }

</style>