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
   </div>
</template>

<script>
   // import appSettings from "../../../shared/settings.json";
   import * as utils from "../../../shared/utils";
   import Topic from "./Topic.vue";
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
         // Activate route filter param from saved state
         this.$router.replace({ path: '/' + this.settings.ui.auto.topicsFilter })

         // listen for background updates
         var self = this;
         browser.runtime.onMessage.addListener(function ( message, sender ) {
            if (typeof message["store-update"] !== "undefined") {
               //utils.logMsg({ msg: message, component: self, store: self.$store });
               self.$store.dispatch("fetchFromStorage", "topics");
            }
            return Promise.resolve("dummy");
         });
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
</style>
