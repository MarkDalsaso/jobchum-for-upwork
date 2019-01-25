<template>
   <div class="panel">
      <button @click="testInit()" class="btn1">Test 1</button>
      &nbsp;
      <button
         v-if="settings && settings.jobMonkeyUi"
         class="btn1"
         @click="toggleMainSwitch()"
      >Main switch on: {{ settings.jobMonkeyUi.isOn }}</button>

      <!-- 
      <button class="btn1" @click="toggleMainAlarm">
         jobMonkey is 
         <span class="main-alarm-base" 
            :class="{ 'main-alarm-on': userSettings.isOn }">
            {{ userSettings.isOn ? "On" : "Off" }}
         </span>            
      </button>
      -->
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
         this.$store.dispatch("initState")
      },
      mounted() {
         // listen for background updates
         browser.runtime.onMessage.addListener(function handleMessage(
            message,
            sender
         ) {
            if (message.type == "store-update") {
               debugger;
            }
         });
      },
      methods: {
         updateTopics(evt) {
            let topic = evt.topic
            this.$store.dispatch('persistToStorage', {'topics': this.topics})
            .then(() => {
               //utils.logMsg({"topic updated": "name" + topic.captured.name})
            })
            .catch(err => { logErr(err); })
         },
         testInit() {
            /* not impmented  */
         },
         toggleMainSwitch() {
            // the main switch (settings.jobMonkeyUi.isOn) controls, and
            // is sync'd with the main alarm/interval (settings.mainAlarm)
            this.settings.jobMonkeyUi.isOn = !this.settings.jobMonkeyUi.isOn;
            this.$store.dispatch('persistToStorage', { settings: this.settings })
            .then(() => { utils.syncAlarmToMainSwitch(this.settings) })
            .catch(err => { utils.logErr(err) });
         },
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
   /* .panel {
            width: 100%;
         } */
</style>
