<template>
  <p>{{ browserStorage }}</p>
</template>

<script>
  import store from "../../../store";
  import * as utils from "../../../shared/utils.js";
  export default {
    data() {
      return {
        browserStorage: {}
      };
    },
    mounted() {
      browser.storage.local.get(null)
        .then(results => {
          utils.logMsg(results);
          this.browserStorage = results;
        })
        .catch(err => {
          utils.logErr(err);
        });
    }
  };
</script>

<style scoped>
  p {
    font-size: 20px;
  }
</style>
