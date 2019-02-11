<template>
   <div>
      <reports-header :hdrInfo="hdrInfo" :rptInfo="rptInfo"
      ></reports-header>
      <div class="panel">
         <table>
            <tr>
               <th>Notification Date</th>
               <th>Topic Name (id)</th>
               <th>Results (recno)</th>
               <th></th>
            </tr>
            <tr v-for="(noti) in prettyNotifications" :key="noti.date">
               <td>{{ noti.date }}</td>
               <td>{{ noti.topic }}</td>
               <td>{{ noti.resultInfo }}</td>
            </tr>
         </table>
         <div>
            <p>Count: {{ prettyNotifications.length }}</p>
         </div>
         <div>
            <button @click="reload()">Reload</button>
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
            prettyNotifications: [],
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
         utils.removeExtPopupMaxWidth()
         this.buildReport()
      },
      methods: {
         reload () {
            this.buildReport()
         },         
         test () {
            alert("boo")
            //document.title = this.titlePrefix + this.rptInfo.title
         },
         buildReport () {
            this.$store.dispatch("loadStateFromStorage")
            .then( () => {
               this.prettyNotifications = this.notifications.map((noti) => {
                  return {
                     date: new Date(noti.date).toString(),
                     topic: noti.topic.name + " (" + noti.topic.id + ")",
                     resultInfo: "(" + noti.results.length + ") " + noti.results.toString()
                  }
               })
            }).catch((err) => { utils.logErr(err) });
         }
      },
      // watch: {},
      computed: {
         notifications() {
            return this.$store.getters.notifications;
         },
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
