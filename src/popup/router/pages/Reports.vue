<template>
   <div>
      <header class="rpt-hdr">
         <h2 class="title" @click="buildReport()">{{ rptInfo.title }}</h2>
      </header>

      <main>
         <div v-if="rptInfo.name==='notifications'">
            <table class="rpt-tbl">
               <thead>
                  <tr>
                     <th>Notification Date</th>
                     <th>
                        Topic Name
                        <span style="color: green">click row to toggle details</span>
                     </th>
                  </tr>
               </thead>
               <tbody v-for="(noti, idx) in notificationsLog" :key="idx">
                  <tr @click="setNotiResults(noti)">
                     <td width="200px">{{ noti.formDate }}</td>
                     <td>{{ noti.topic.name }} ({{noti.recnoAry.length}} results)</td>
                  </tr>
                  <tr v-if="noti.resultsOpen">
                     <td colspan="2" class="dd-contain">
                        <topic-results :tResults="noti.results"></topic-results>
                     </td>
                  </tr>
               </tbody>
               <tfoot>
                  <tr>
                     <th colspan="2">Count: {{ notificationsLog.length }}</th>
                  </tr>
               </tfoot>
            </table>
            <div class="rpt-hdr" style="padding:5px">
               <v-btn class="flt-rgt"
                  :colorClass="'hdr-clr'"
                  :onClick="() => {emptyNotificationsArray()}"
               >Clear Notification Log</v-btn>
            </div>            
         </div>

         <div v-if="rptInfo.name==='topic-results'">
            <topic-results :tResults="topicResultsLog.results"></topic-results>
            <div class="rpt-hdr" style="padding:5px">
               <v-btn class="flt-rgt"
                  :colorClass="'hdr-clr'"
                  :onClick="() => {removeOutdatedResults(topicResultsLog.id)}"
               >{{removeOutdatedResultsBtnText}}</v-btn>
            </div>
         </div>

      </main>
   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   import TopicResults from "./sub/TopicResults.vue";
   import Button from "./sub/Button.vue";
   export default {
      data() {
         return {
            notificationsLog: [],
            topicResultsLog: {},
            rptInfo: {
               name: "",
               title: "",
               topicId: 0
            }
         };
      },
      created() {
         this.rptInfo.name = this.$route.query.report;
         this.rptInfo.topicId = this.$route.query.id;
         let self = this;
         browser.storage.onChanged.addListener(function(changesObject, areaName) {
            //if ("topics" in changesObject || "notifications" in changesObject) {
            if ("notifications" in changesObject) {
               self.buildReport();
            }
         });
         //utils.logMsg(this.rptInfo)
      },
      mounted() {
         utils.removeExtPopupMaxWidth();
         this.buildReport();
      },
      methods: {
         buildReport() {
            switch (this.rptInfo.name) {
               case "notifications":
                  this.doNotificationsLog();
                  this.rptInfo.title = "Notifications Log";
                  break;
               case "topic-results":
                  this.doTopicResultsLog();
                  this.rptInfo.title =
                     "Topic Results: " + this.topicResultsLog.captured.name;
                  break;
            }
            document.title = "jobChum " + this.rptInfo.title;
         },
         doNotificationsLog() {
            this.$store
               .dispatch("loadStateFromStorage")
               .then(() => {
                  this.notificationsLog = this.notifications.map(noti => {
                     return {
                        resultsOpen: false,
                        formDate: utils.formatDate(noti.date),
                        topic: noti.topic,
                        date: noti.date,
                        recnoAry: noti.results,
                        results: []
                     };
                  });
                  // Auto-open (expand) most recent topic (works but turned off)
                  // if (this.notificationsLog.length > 0)
                  //    this.setNotiResults(this.notificationsLog[0])
               })
               .catch(err => {
                  utils.logErr(err);
               });
         },
         setNotiResults(noti) {
            noti.results = this.getNotiResults(noti.topic.id, noti.recnoAry);
            noti.resultsOpen = !noti.resultsOpen;
         },
         getNotiResults(topicId, recnoAry) {
            let allTopicResults = this.$store.getters.topicById(topicId).results;
            let notiResults = allTopicResults.filter(result => {
               return recnoAry.includes(result.recno);
            });
            return notiResults;
         },
         doTopicResultsLog() {
            this.topicResultsLog = this.$store.getters.topicById(this.rptInfo.topicId);
         },
         emptyNotificationsArray () {
            this.$store.commit('notifications', [])
            this.$store.dispatch('persistToStorage', 'notifications')
         },
         removeOutdatedResults(topicId) {
            utils.removeOutdatedResults(this.$store, topicId, () => {this.buildReport()} )
         }
      },
      computed: {
         notifications() {
            return this.$store.getters.notifications;
         },
         removeOutdatedResultsBtnText() {
            let btnTxt = "Remove old results"
            if (this.topicResultsLog.custom) {
               btnTxt += " (results older than " + this.topicResultsLog.custom.daysOldIgnore + " day(s) will be deleted.)"
            }
         return btnTxt
         }
      },
      components: {
         "topic-results": TopicResults,
         "v-btn": Button
      }
   };
</script>

<style scoped>
   .rpt-hdr {
      height: 38px; /* 38 (for title) + 23 (for column headers) */
      background-color: rgb(232, 219, 170);
   }
   main {
      padding-top: 38px;
   }
   tbody tr:first-child:hover {
      background-color: #aaa;
      cursor: hand;
      cursor: pointer;
   }
   .dd-contain {
      /* special dropdown container */
      padding: 15px;
      background-color: rgba(255, 255, 255, 0.75);
   }
   tbody:nth-child(odd) {
      background-color: rgb(246, 232, 181);
   }
   tbody:nth-child(even) {
      background-color: rgb(255, 237, 209);
   }
</style>
