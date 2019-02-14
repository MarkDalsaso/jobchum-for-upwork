<template>
   <div class="panel">

      <!-- <p>filter {{ filter }}</p> -->
      <!-- <span class="btn1" @click="test1()">Test1</span> -->

      <topic
         v-for="(topic) in topics"
         v-bind:topic="topic"
         v-bind:key="topic.id"
         @topic-modified="updateTopics($event)"
      ></topic>

      <div v-if="filter === 'all' && topics.length === 0"
           @click="reloadSyncTopics()"
           class="load-topics">
         <p class="btn1">Click here to synchronize jobChimp with your Upwork (Find Work) search topics</p>
      </div>

      <div v-if="filter === 'on' && topics.length === 0"
         class="load-topics" >
         <br>
         <p>There are no switched 'On' search topics.</p>
         <p>Click the 'All' filter to switch On/Off individual topics.</p>
         <p>Click the 'Master switch' (in header) to toggle overall, jobChimp functionality</p>
         
      </div>

   </div>
</template>

<script>
   import * as utils from "../../../shared/utils";
   import Topic from "./sub/Topic.vue";
   export default {
      data () {
         return {
            filter: this.$route.params.filter
         }
      },
      watch: {
         '$route': function(to, from) {
            if (to.params) {
               this.filter = to.params.filter || 'all';
            }
         }
      },
      components: {
         topic: Topic
      },
      mounted() {
         // listen for background updates
         let self = this
         browser.storage.onChanged.addListener(function (changesObject, areaName) {
            if ('topics' in changesObject) {
               self.$store.dispatch("fetchFromStorage", "topics");
            }
         })
      },
      methods: {
         updateTopics (event) {
            let topic = event.topic;
            this.$store
               .dispatch('persistToStorage', 'topics')
               .then(() => {
                  //this.$router.replace({ path: '/' + this.filter })
                  //utils.logMsg({"topic updated": "name" + topic.captured.name})
               })
               .catch(err => { utils.logErr(err); });
         },
         reloadSyncTopics () {
            const code = "window.location.replace('" +
               this.settings.sys.requeryBaseUrl + "')";
            browser.tabs.executeScript(null, { code: code });
         },
         test1() { }      
      },
      computed: {
         topics() {
            // Always update current state (topics filter) when filter changes
            let filterObj = this.$store.getters.topicsByFilterName(this.filter)
            this.$store.dispatch('updateTopicsFilterState', filterObj.state)
            return filterObj.topics
         },
         settings() {
            return this.$store.getters.settings;
         }
      }
   };
</script>

<style scoped>
   .load-topics {
      width: 100%;
      text-align: center
   }

   .load-topics > p.btn1 {
      width: 80%;
       background-color: rgb(181, 206, 246);
   }

   .panel {
      min-height: 900px;
      margin-top: 84px;
   }
</style>
