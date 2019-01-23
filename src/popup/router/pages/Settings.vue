<template>
   <div class="panel">
      <textarea wrap="off" v-model="settings" class="jsonTextarea" spellcheck="false"></textarea>
   </div>
</template>

<script>
   export default {
      computed: {
         settings() {
            let rtn = JSON.stringify(this.$store.getters.settings, null, 2)
            return rtn;
         }
      }
   }
</script>

<style>
   .jsonTextarea {
    box-sizing: border-box;
    border: none;
    width: 96%;
    height: 735px;
    background-color: rgb(248, 248, 213);
    margin: 8px 3px 8px 3px;
    padding: 3px;
    overflow: auto;
}
</style>
