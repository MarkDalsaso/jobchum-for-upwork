<template>
   <div class="panel">
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
      //data() { return { }; },  // Currently not implemented
      components: {
         topic: Topic
      },
      created() {
         //this.$store.dispatch("initState");
         // NOTE: also do a message['store-update'] here if topics = {}
      },
      mounted() {
         // listen for background updates
         var thisComponent = this;
         browser.runtime.onMessage.addListener(function ( message, sender ) {
            if (typeof message["store-update"] !== "undefined") {
               utils.logMsg({
                  msg: message,
                  thisComponent: thisComponent,
                  store: thisComponent.$store
               });
               //thisComponent.$store.dispatch('initState')
               thisComponent.$store.dispatch("fetchFromStorage", "topics");
            }
            return Promise.resolve("dummy");
         });
      },
      methods: {
         updateTopics(event) {
            let topic = event.topic;
            this.$store
               .dispatch('persistToStorage', 'topics')
               .then(() => {
                  //utils.logMsg({"topic updated": "name" + topic.captured.name})
               })
               .catch(err => { utils.logErr(err); });
         },
         testInit() {
            /* not impmented  */
         }      },
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
</style>
