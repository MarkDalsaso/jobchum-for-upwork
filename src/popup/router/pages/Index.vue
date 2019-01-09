<template>
  <p>{{ browserStorage }}</p>
</template>

<script>
  import store from "../../../store";
  export default {
    data() {
      return {
        browserStorage: {}
      };
    },
    mounted() {
      browser.storage.local
        .get("jmStore")
        .then(results => {
          console.log(results);
          this.browserStorage = results;
        })
        .catch(err => {
          console.log({ err: err });
        });
    }
  };
</script>

<style scoped>
  p {
    font-size: 20px;
  }
</style>
