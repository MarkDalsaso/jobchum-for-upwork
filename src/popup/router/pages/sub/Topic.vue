<template>
   <section class="sub-panel" :class="greyOnInactive">
      <table class="topics-table">

         <tr>
            <td>
               <span class="topic-name"
                  @click="reQueryTopic()"
               >{{ topic.captured.name }}</span>
            </td>
            <td>
               <toggle-switch title="Topic switch" style="float: right"
                  v-model="topic.custom.enabled"
                  @input="rowChg()"
               ></toggle-switch>
            </td>
         </tr>

         <tr>
            <td colspan="2">
               <label>Qry. interval</label>
               <input class="btn1" type="number"
                  v-model.number="topic.custom.qInterval"
                  @change="rowChg(topic)"
                  placeholder="minutes"
               > (min.)

               <span style="float: right">
                  <label>Ignore after</label>
                  <input  class="btn1" type="number"
                     v-model.number="topic.custom.daysOldIgnore"
                     @change="rowChg(topic)"
                     placeholder="days"
                  > (days)
               </span>

            </td>
         </tr>

         <tr>
            <td colspan="2" style="height: 30px">
               Last query: {{ lastQuery(topic.custom.qLastRequest) }}
               &nbsp; &nbsp; &nbsp;
               Next query: {{ nextQuery(topic.custom.qLastRequest, topic.custom.qInterval) }}

               <v-btn v-if="topic.results.length > 0"
                  style="float: right"
                  :onClick="function () { openTopicResultsReport(topic.id) }"
                  :iconSrc="reportsIcon"
                  :colorClass="'tpc-clr'"
                  :title="'Results (' + topic.results.length + ')'"
               ></v-btn>

            </td>
         </tr>
      </table>

   </section>
</template>

<script>
   import reportsIcon from "@/assets/reports.png"
   import * as utils from "../../../../shared/utils";
   import ToggleSwitch from "./ToggleSwitch.vue";
   import Button from "./Button.vue";
   
   export default {
      data () {
         return {
            reportsIcon: reportsIcon,
         }
      },
      props: ["topic"],
      methods: {
         rowChg() {
            this.$emit("topic-modified", { topic: this.topic });
         },
         reQueryTopic(evt) {
            utils.reQueryById(this.$store, this.topic.id);
         },
         lastQuery: function(dateInt) {
            return formatDateTime(dateInt);
         },
         nextQuery: function(dateInt, interval) {
            // convert minute-based interval to milliseconds
            if (!dateInt) return "";
            var nextQryInt = dateInt + interval * 60 * 1000;
            if (nextQryInt < Date.now()) return "overdue";
            else return formatDateTime(nextQryInt);
         },
         openTopicResultsReport(id) {
            let aux = new utils.AuxWindow({
               url: "../popup/popup.html?p=reports&report=topic-results&id=" + id,
               name : 'topic-results'
            })
            utils.openAuxilaryWindow(this.$store, aux)         
         },
      },
      computed: {
         greyOnInactive: function() {
            if (
               !this.$store.state.settings.ui.auto.isOn ||
               !this.topic.custom.enabled
            ) {
               return { "grey-out": true };
            }
         }
      },
      components: {
         "toggle-switch": ToggleSwitch,
         "v-btn": Button
      }
   };

   function formatDateTime(dateInt) {
      if (!dateInt) return "";
      var date = new Date(dateInt);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      var strDate = "";
      // Following commented-out code left in for future date options and refinements
      //strDate = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
      //strDate = date.getMonth()+1 + "/" + date.getDate() + "/";
      return strDate + " " + strTime;
   }
</script>

<style scoped>
   .sub-panel {
      background-color: rgb(181, 206, 246);
   }

   .grey-out {
      background-color: rgb(186, 194, 207);
   }
   section {
      margin: 6px;
      padding-top: 2px;
      border-radius: 3px;
   }
   .topics-table {
      width: 100%;
      table-layout: fixed;
   }   
   .topics-table tr:nth-child(1),
   .topics-table tr:nth-child(2) {
      height: 35px;
      vertical-align: top;
      padding: 0 0 0 0;
   }
   .topics-table tr:nth-child(1) td:nth-child(1) {
      width: 88%;
   }
   .topics-table td {
      padding: 2px;
      overflow: hidden;
      white-space: nowrap;
      /* border: 1px solid black; */
   }
   /* .topics-table td.enable-btn-col {
      text-align: right;
   } */
   span.topic-name {
      font-weight: 700;
      font-size: larger;
      cursor: hand;
      cursor: pointer;
   }
   span.topic-name:hover {
      text-decoration: underline;
   }
   .topic-options {
      line-height: 1.2em;
   }
   .btn1 {
      background-color: rgba(235, 239, 245, 0.5);
   }
   input.btn1[type="number"] {
      width: 55px;
      margin: 0 0 0 4px;
      padding: 3px;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25);
   }
   .btn1:hover,
   .btn1:active,
   .btn1:hover > input[type] {
      background-color: rgba(231, 235, 240, 0.87);
   }
   .inner-results {
      width: 100%; display: block;
   }
</style>