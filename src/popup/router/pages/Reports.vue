<template>
   <div>
      <reports-header 
         :hdrInfo="hdrInfo"
         :rptInfo="rptInfo"
      ></reports-header>
      <div class="panel">
         <!-- :style="{ 'margin-top': hdrInfo.fixedHeight +'px' }" -->
         <div>
            <button @click="test()">Say Boo</button>
         </div>
         <div>
            <p>report name : {{ this.rptInfo.name }}</p>
         </div>
      </div>
   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   import ReportsHeader from "./ReportsHeader.vue";
   export default {
      data() { 
         return {
            hdrInfo: {
               fixedHeight: 38,
               titlePrefix: "jC - "
            },
            rptInfo: {
               name: '',
               title: '',
            }
         };
      },
      created() {
         this.rptInfo.name = this.$route.query.report
         switch(this.rptInfo.name) {
            case 'notifications':
               this.rptInfo.title = "Notification History"
               break
            case 'topicResults':
               this.rptInfo.title = "Topic Results"
               break
         }
      },
      mounted() {
         // nix max-width popup hack
         document.querySelector("body > div").removeAttribute("style")
       },
      methods: {
         test () {
            alert("boo")
            //document.title = this.titlePrefix + this.rptInfo.title
         },
      }, 
      computed: {
         topics() {
            return this.$store.getters.topics;
         },
         settings() {
            return this.$store.getters.settings;
         }
      },
      components: {
         'reports-header': ReportsHeader
      },
   };
</script>

<style scoped>
   html, body {
      min-height: unset
   } 
   .panel {
      margin-top: 38px;
   }
</style>
