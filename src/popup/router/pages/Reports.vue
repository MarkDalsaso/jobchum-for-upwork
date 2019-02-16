<template>
   <div>

      <header :style="{ height: hdrInfo.fixedHeight +'px' }" >
         <h2 class="title" @click="buildReport()">
            {{ hdrInfo.titlePrefix + rptInfo.title }}
         </h2>
      </header>

      <main :style="{ 'padding-top': hdrInfo.fixedHeight +'px' }">

         <div v-if="rptInfo.name==='notifications'">
            <table class="tbl-sticky-hdr">
               <thead>
                  <tr>
                     <th :style="{'top': hdrInfo.fixedHeight +'px'}">Notification Date</th>
                     <th :style="{'top': hdrInfo.fixedHeight +'px'}">Topic Name (id)</th>
                     <th :style="{'top': hdrInfo.fixedHeight +'px'}">Results (recno)</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(noti) in notificationsReport" :key="noti.date">
                     <td>{{ noti.date }}</td>
                     <td>{{ noti.topic }}</td>
                     <td>{{ noti.resultsInfo }}</td>
                  </tr>
               </tbody>
            </table>
            <div>
               <p>Count: {{ notificationsReport.length }}</p>
            </div>
            <div>
               <button @click="reload()">Reload</button>
               <p>report name : {{ this.rptInfo.name }}</p>
               
            </div>
         </div>

         <topic-results
            v-if="rptInfo.name==='topic-results'"
            :tResults = "topicResultsReport.results"
            :stickyTop = "hdrInfo.fixedHeight"
         ></topic-results>

      </main>

   </div>
</template>

<script>
   import * as utils from "../../../shared/utils.js";
   import TopicResults from "./sub/TopicResults.vue";
   export default {
      data() { 
         return {
            notificationsReport: [],
            topicResultsReport: [],
            hdrInfo: {
               fixedHeight: 38,
               titlePrefix: "jC "
            },
            rptInfo: {
               name: '',
               title: '',
               topicId: 0
            }
         };
      },
      created() {
         this.rptInfo.name = this.$route.query.report
         this.rptInfo.topicId = this.$route.query.id
         let self = this
         browser.storage.onChanged.addListener(function (changesObject, areaName) {
            if ('notifications' in changesObject || 'topics' in changesObject) {
               self.buildReport()
            }
         })
         //utils.logMsg(this.rptInfo)
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
            switch(this.rptInfo.name) {
               case 'notifications':
                  this.doNotificationsReport()
                  this.rptInfo.title = "Notification History"
                  break
               case 'topic-results':
                  this.doTopicResultsReport()
                  this.rptInfo.title =
                     "Results for Topic: " + this.topicResultsReport.captured.name
                  break
            }
            document.title = this.hdrInfo.titlePrefix + this.rptInfo.title
         },
         doNotificationsReport() {
            this.$store.dispatch("loadStateFromStorage")
            .then( () => {
               this.notificationsReport = this.notifications.map((noti) => {
                  return {
                     //date: new Date(noti.date).toString(),
                     date: utils.formatDate(noti.date),
                     topic: noti.topic.name + " (" + noti.topic.id + ")",
                     results: noti.results,
                     resultsInfo: "(" + noti.results.length + ") " + noti.results.toString()
                  }
               })
            }).catch((err) => { utils.logErr(err) });
         },
         doTopicResultsReport() {
            this.topicResultsReport = 
               this.$store.getters.topicById(this.rptInfo.topicId)
         },
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
         'topic-results':TopicResults
      },
   };
</script>

<style scoped>
   header {
      /* background-color: rgba(32, 31, 25, 0.068); */
      background-color: rgb(232, 219, 170);
      position: fixed;
      top: 0;
      z-index: 10;
   }
   main { margin: 0 }
</style>
