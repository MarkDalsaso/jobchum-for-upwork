<template>
  <p>Hello world!</p>
</template>

<script>
  export default {
    data() {
      return {};
    },
    mounted() {
      // browser.runtime.sendMessage({})
      if (chrome) {
         chrome.runtime.sendMessage({})
      } else {
         browser.runtime.sendMessage({})
      }
    }
  };
</script>

<style scoped>
  p {
    font-size: 20px;
  }
</style>
