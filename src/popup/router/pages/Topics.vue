<template>
   <div class="panel">

      <transition-group :name="transitionGroup">
         <topic
            class="slide"
            v-for="(topic) in topics"
            v-bind:topic="topic"
            v-bind:key="topic.id"
            @topic-modified="updateTopics($event)"
         ></topic>
      </transition-group>
      
      <div v-if="filter === 'all' && topics.length === 0"
           class="special-msg">
         <v-btn :height = "50"
               :onClick="reloadSyncTopics"
               :colorClass="'hdr-clr'">
            Click here to synchronize jobChum with your Upwork (Find Work) search topics
         </v-btn>
      </div>

      <div v-if="filter === 'on' && topics.length === 0"
         class="special-msg">
         <p>There are no switched <strong>On</strong> search topics.</p>
         <p>Click the <strong>All</strong> filter to switch On/Off individual topics.</p>
         <p>Click the <strong>Master switch</strong> (in header) to toggle overall, jobChum functionality</p>
         
      </div>

   </div>
</template>

<script>
   import * as utils from "../../../shared/utils";
   import Topic from "./sub/Topic.vue";
   import Button from "./sub/Button.vue";
   export default {
      data () {
         return {
            transitionGroup: 'slide',
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
            //this.transitionGroup = 'slide'
            let topic = event.topic;
            this.$store
               .dispatch('persistToStorage', 'topics')
               .then(() => {
                  //this.$router.replace({ path: '/' + this.filter })
                  //utils.logMsg({"topic updated": "name" + topic.captured.name})
               })
               .catch(err => { utils.logErr(err); });
               //this.transitionGroup = 'slideOff'
         },
         reloadSyncTopics () {
            const code = "window.location.replace('" +
               this.settings.sys.requeryBaseUrl + "')";
            browser.tabs.executeScript(null, { code: code });
         }
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
      },
      components: {
         topic: Topic,
         "v-btn": Button
      }
   };
</script>

<style scoped>
   .slide {
      transition: all .75s;
      display: flex;
   }
   .slide-enter {
      opacity: 0;
   }
   .slide-leave-to {
      opacity: 0;
      transform: translateX(-100%);
   }
   .slide-leave-active {
      transition: all .75s;
      position: absolute;
   }
   .special-msg {
      height: 185px; 
      width: 75%;
      margin: 120px auto 0 auto;
   }
   .panel {
      margin-top: 84px;
   }
</style>
