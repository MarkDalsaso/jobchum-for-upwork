<template>
   <div>

      <header :style="{ height: hdrInfo.fixedHeight +'px' }" >
         <h2 class="title" @click="buildReport()">
            {{ rptInfo.title }}
         </h2>
      </header>

      <main :style="{ 'padding-top': hdrInfo.fixedHeight +'px' }">

         <div v-if="rptInfo.name==='notifications'">
            <table class="tbl-sticky-hdr">
               <thead>
                  <tr>
                     <th :style="{'top': hdrInfo.fixedHeight +'px'}">Notification Date</th>
                     <th :style="{'top': hdrInfo.fixedHeight +'px'}">Topic Name</th>
                     <th :style="{'top': hdrInfo.fixedHeight +'px'}">Results</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(noti, idx) in notificationsReport" :key="idx">
                     <td colspan="3" @click="setNotiResults(noti)">
                        <span style="width=150">{{ noti.formDate }}</span>
                        <span>{{ noti.topic.name }} ({{noti.recnoAry.length}})</span>
                        <topic-results
                           v-if="noti.resultsOpen"
                           :tResults = "noti.results"
                        ></topic-results>
                     </td>
                  </tr>
               </tbody>
            </table>
            <div>
               <p>Count: {{ notificationsReport.length }}</p>
            </div>
         </div>

         <topic-results
            v-if="rptInfo.name==='topic-results'"
            :tResults = "topicResultsReport.results"
            :stickyTop = "hdrInfo.fixedHeight"
         ></topic-results>

         <div>
            <button @click="buildReport()">Rebuild Report {{ this.rptInfo.name }}</button>
         </div>

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
         test () {
            alert("boo")
            //document.title = this.titlePrefix + this.rptInfo.title
         },
         buildReport () {
            switch(this.rptInfo.name) {
               case 'notifications':
                  this.doNotificationsReport()
                  this.rptInfo.title = "Notifications Log"
                  break
               case 'topic-results':
                  this.doTopicResultsReport()
                  this.rptInfo.title =
                     "Topic Results: " + this.topicResultsReport.captured.name
                  break
            }
            document.title = this.hdrInfo.titlePrefix + this.rptInfo.title
         },
         doNotificationsReport() {
            this.$store.dispatch("loadStateFromStorage")
            .then( () => {
               this.notificationsReport = this.notifications.map((noti) => {
                  return {
                     resultsOpen: false,
                     formDate: utils.formatDate(noti.date),
                     topic: noti.topic,
                     date: noti.date,
                     recnoAry: noti.results,
                     results: []
                  }
               })
            }).catch((err) => { utils.logErr(err) });
         },
         setNotiResults(noti) {
            noti.results = this.getNotiResults(noti.topic.id, noti.recnoAry)
            noti.resultsOpen = !noti.resultsOpen
         },
         getNotiResults(topicId, recnoAry) {
            let allTopicResults = this.$store.getters.topicById(topicId).results
            let notiResults = allTopicResults.filter( (result) => {
               return recnoAry.includes(result.recno)
            })
            return notiResults
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
