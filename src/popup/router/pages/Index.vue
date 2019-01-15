<template>
  <div>
    <p>topics: {{ topics }}</p>
    <br>
    <div>
      <button @click="initStore()">Init. Store</button>
    </div>
  </div>
</template>

<script>
  //import store from "../../../store";
  import * as utils from "../../../shared/utils.js";
  export default {
    data() {
      return {};
    },
    created () {
      //this.$store.dispatch('getFromBrowserStorage', 'topics')
    },
    methods: {
       initStore () {
          this.$store.dispatch('getFromBrowserStorage', 'topics')
       }
    },
    computed: {
      topics () { 
         return this.$store.getters.topics;
      }
    }
  };
</script>

<style scoped>
  p {
    font-size: 20px;
  }
</style>
