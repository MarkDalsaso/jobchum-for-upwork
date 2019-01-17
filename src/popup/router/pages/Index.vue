<template>
  <div class="panel">
    <div>
      <button @click="dumpStorage()">Storage Dump All</button>
      <button @click="dumpStorage('settings')">Storage Dump Settings</button>
      <button @click="dumpStorage('topics')">Storage Dump Topics</button>
      <button @click="initVuexState()">Init. Vuex State</button>
      <button @click="clearExtensionState()">Wipe/Clear ALL State (testing)</button>
      <button @click="reloadFindWorkPage()">Reload if topics = []</button>
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
        jsonDump: {}
      };
    },
    created() {
      this.initVuexState();
    },
    mounted() {},
    methods: {
      dumpStorage(key = null) {
        browser.storage.local.get(key).then(results => {
          if (key) {
            this.jsonDump = JSON.stringify(results[key], null, 2);
          } else {
            this.jsonDump = JSON.stringify(results, null, 2);
          }
        });
      },
      initVuexState() {
        this.$store.dispatch("initVuexState");
      },
      clearExtensionState() {
        this.$store.dispatch("wipeExtensionState");
      },
      reloadFindWorkPage() {
        this.$store.dispatch("getFromBrowserStorage", "topics")
        .then(topics => {
          if (topics.length == 0) {
            const code =
              "window.location.replace('" + jmSettings.requeryBaseUrl + "')";
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
  .panel {
    width: 400px;
    height: 400px;
  }
  .json {
    background-color: #eeece0;
    font-size: 14px;
  }
  button {
    margin: 5px;
  }
</style>
