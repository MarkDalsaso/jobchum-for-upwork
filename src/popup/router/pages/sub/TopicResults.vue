<template>
   <table class="rpt-tbl">
      <thead>
         <tr>
            <th>Published</th>
            <th>Job Title</th>
         </tr>
      </thead>
      <tbody>
         <tr
            v-for="(tResult) in sortedResults"
            :key="tResult.recno"
         >
            <td width="200px">
               {{ formatDate(tResult.publishedOn) }}
            </td>
            <td>
               <a :href="'https://www.upwork.com/jobs/' + tResult.ciphertext" target="_blank">
                  {{ tResult.title }}
               </a>
            </td>
         </tr>
      </tbody>
      <tfoot><tr><th colspan="2">Count: {{ tResults.length }}</th></tr></tfoot>
   </table>
</template>

<script>
   import * as utils from "../../../../shared/utils.js";
   export default {
      props: {
         tResults: { type: Array, default: () => []}
      },
      methods: {
         formatDate (dtIn) {
            return utils.formatDate(dtIn)
         }
      },
      computed: {
         sortedResults () {
            let sortedAry = this.tResults.sort(
               (a, b) => {
                  if (a.publishedOn > b.publishedOn) { return -1 }
                  else if (b.publishedOn < a.publishedOn) { return 1 }
                  return 0
               })
            return sortedAry
         }
      }
   };
</script>

<style scoped>
   tbody tr:nth-child(odd) {
       background-color: rgba(231, 235, 240, 0.87);
   }
   tr:nth-child(even) {
       background-color: rgb(181, 206, 246);
   }
</style>
