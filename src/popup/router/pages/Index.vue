<template>
  <div class='panel'>
    <div>
      <button @click="dumpStorage()">Storage Dump All</button>
      <button @click="dumpStorage('settings')">Storage Dump Settings</button>
      <button @click="dumpStorage('topics')">Storage Dump Topics</button>
      <button @click="initVuexStore()">Init. Vuex Store</button>
      <button @click="clearExtensionState()">Wipe/Clear ALL State (testing)</button>
      <button @click="reloadFindWorkPage()">Reload if topic = {}</button>
      <button @click="widthToggle()">Toggle Width</button>
    </div>
    <div>
      <pre class="json">{{ jsonDump }}</pre>
    </div>
  </div>
</template>

<script>
  import * as utils from "../../../shared/utils.js";
  import jmSettings from "../../../shared/settings.json";
  export default {
    data() {
      return {
        defaultBodyWidth: 400,
        jsonDump: {}
      };
    },
    created() {
      //this.initVuexStore();
    },
    mounted() {
       this.defaultBodyWidth = document.getElementsByTagName("BODY")[0].style.width;
    },
    methods: {
      dumpStorage(key = null) {
        browser.storage.local.get(key).then(results => {
          this.jsonDump = JSON.stringify(results, null, 3);
        });
      },
      initVuexStore() {
        this.$store.dispatch("initVuexState");
      },
      clearExtensionState() {
        this.$store.dispatch("wipeExtensionState");
      },
      reloadFindWorkPage() {
        if (Object.keys(this.topics).length === 0) {
          const code =
            "window.location.replace('" + jmSettings.requeryBaseUrl + "')";
          browser.tabs.executeScript(null, { code: code }).them(() => {
            utils.logMsg("Boo");
          });
        }
      },
      widthToggle() {
         let temp = document.getElementsByTagName("BODY");
         // if (typeof temp == "number")
         //    document.body.style.width = 'auto';
         // else
         //    document.body.style.width = this.defaultBodyWidth;
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
    width: 400px;
    height: 400px;
   }
  .json {
     background-color:#8cc7c7;
     font-size: 14px;
  }
  button {
    margin: 5px;
  }
</style>
