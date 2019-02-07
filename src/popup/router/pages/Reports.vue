<template>
   <div class="panel">
      <div>
         <span class="btn1" @click="test()">Say Boo</span>
      </div>
      <div>
         <p>report name : {{reportName}}</p>
         <!-- <textarea wrap="off" v-model="jsonDump" class="jsonTextarea" spellcheck="false"
         ></textarea> -->

      </div>
   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   import sysSettings from "../../../shared/settings.json";
   export default {
      data() { 
         return {
            reportName: '',
            reportParams: {}
         };
      },
      created() {
         this.reportName = this.$route.query.report
         switch(reportName) {
            case notifications:
               break
            case topicResults:
               break
         }

      },
      mounted() { },
      methods: {
         test () {
            alert('Boo!')
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
   .btn1 {
      margin-right: 10px;
   }
   .panel > div > .btn1 {
      margin: 3px 14px;
   }
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
