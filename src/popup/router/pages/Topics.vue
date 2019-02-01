<template>
   <div class="panel">

      <!-- <p>filter {{ filter }}</p> -->
      <!-- <span class="btn1" @click="test1()">Test1</span> -->

      <topic
         v-for="(topic, index) in topics"
         v-bind:topic="topic"
         v-bind:index="index"
         v-bind:key="index"
         @topic-modified="updateTopics($event)"
      ></topic>
   </div>
</template>

<script>
   // import jmSettings from "../../../shared/settings.json";
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
         
         this.filter = this.settings.jmUi.topicsFilter

         // listen for background updates
         var thisComponent = this;
         browser.runtime.onMessage.addListener(function ( message, sender ) {
            if (typeof message["store-update"] !== "undefined") {
               utils.logMsg({
                  msg: message,
                  thisComponent: thisComponent,
                  store: thisComponent.$store
               });
               thisComponent.$store.dispatch("fetchFromStorage", "topics");
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
                  //utils.logMsg({"topic updated": "name" + topic.captured.name})
               })
               .catch(err => { utils.logErr(err); });
         },
         test1() {
            /*
            this.$router.replace({ path: '/2' })
            this.topics.forEach(topic => {
               let t1 = topic.custom.enabled
               let t2 = ''
            });
            utils.logMsg({ 'filteredTopics': t1.length })
            */
         }      
      },
      computed: {
         topics() {
            return this.$store.getters.topicsByFilterIndex(this.filter);
         },
         settings() {
            return this.$store.getters.settings;
         }
      }
   };
</script>

<style scoped>
</style>
