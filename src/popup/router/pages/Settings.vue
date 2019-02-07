<template>
   <div class="panel">

      <h4>Settings</h4>
      <section class="grid">

         <div>
            <toggle-switch title="Topic switch"
               v-model="settings.ui.user.playSound"
               @input="persist()"
             ></toggle-switch>
            <label>Play sound on notification of results</label>             
         </div>

         <div>
            <toggle-switch title="Topic switch"
               v-model="settings.ui.user.domesticTopic"
               @input="persist()"
             ></toggle-switch>
            <label>Include 'Domestic', ( 'U.S. Only' for example) as query topic</label>
         </div>

         <div>
            <toggle-switch title="Topic switch"
               v-model="settings.ui.user.myFeedTopic"
               @input="persist()"
             ></toggle-switch>
            <label>Include 'My Feed' as query topic</label>
         </div>
      
      </section>
      
      <!-- <section></section> -->
      <div v-if="devMode">
         <br/><h4>JSON (dev mode)</h4>
         <textarea wrap="off" v-model="settingsJson" class="jsonTextarea" spellcheck="false"></textarea>
      </div>
      

   </div>
</template>

<script>
import * as utils from "../../../shared/utils";
   import ToggleSwitch from "./ToggleSwitch.vue";
   export default {
      methods: {
         persist(callback) {
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
         "toggle-switch": ToggleSwitch
      }      
   }
</script>

<style scoped>
   section {
      background-color: rgb(181, 206, 246);
    }
   section.grid > div {
      padding: 4px;
      display: grid;
      grid-template-columns: 1fr 6fr; 
   }
   .jsonTextarea {
      box-sizing: border-box;
      border: none;
      width: 96%;
      height: 735px;
      background-color: rgb(248, 248, 213);
      margin: 6px 3px 8px 6px;
      padding: 3px;
      overflow: auto;
   }
</style>
