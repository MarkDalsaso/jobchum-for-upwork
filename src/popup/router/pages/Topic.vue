<template>
   <section class="topic-blue" :class="greyOnInactive">
      <table class="topics-table">
         <tr>
            <td>
               <span
                  class="topic-name btn1"
                  @click="reQueryTopic()"
               >{{ topic.captured.name }}</span>
            </td>
            <td class="enable-btn-col">
               <span class="btn1">
                  <label :for="'enabled-checkbox_'+index">Enabled</label>
                  <input
                     type="checkbox"
                     :id="'enabled-checkbox_'+index"
                     v-model="topic.custom.enabled"
                     @change.stop="rowChg()"
                  >
               </span>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <label>Query interval</label>
               <input
                  type="number"
                  class="btn1 interval"
                  v-model.number="topic.custom.qInterval"
                  v-on:change="rowChg(topic)"
                  placeholder="minutes"
               > (minutes)
            </td>
         </tr>
         <tr>
            <td colspan="2">
               Last query: {{ lastQuery(topic.custom.qLastRequest) }}
               &nbsp; &nbsp; &nbsp;
               Next query: {{ nextQuery(topic.custom.qLastRequest, topic.custom.qInterval) }}
            </td>
         </tr>

         <!--  "more info" expand/collapse
            <tr>
                <td colspan=2>
                    filters: {{ topic.captured.q }}
                </td>
            </tr>             
         "more info" expand/collapse-->
      </table>
   </section>
</template>

<script>
   import * as utils from "../../../shared/utils";
   export default {
      props: ["topic", "index"],
      methods: {
         rowChg() {
            this.$emit("topic-modified", { topic: this.topic });
         },
         reQueryTopic(evt) {
            utils.reQueryById(this.topic.id);
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
         }
      },
      computed: {
         greyOnInactive : function () {
            if (
                  !this.$store.state.settings.jobMonkeyUi.isOn ||
                  !this.topic.custom.enabled
               )
            {
               return { 'grey-out': true }
            }
         }
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
   .topic-blue {
      background-color: rgb(181, 206, 246);
   }

   .grey-out {
      background-color: rgb(186, 194, 207);
   }

   .topics-table td {
      padding: 2px;
      overflow: hidden;
      white-space: nowrap;
      /* border: 1px solid black; */
   }

   .topics-table td.enable-btn-col {
      text-align: right;
   }

   /* .topic-name {
      font-weight: bold;
   } */

   .topic-options {
      line-height: 1.2em;
   }

   .topics-table .interval {
      width: 65px;
      margin-left: 3px;
   }
</style>