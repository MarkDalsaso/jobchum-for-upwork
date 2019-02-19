<template>
   <table class="tbl-sticky-hdr alt-rows">
      <thead>
         <tr>
            <th :style="{'top': stickyTop +'px'}">Published</th>
            <th :style="{'top': stickyTop +'px'}">Job Title</th>
         </tr>
      </thead>
      <tbody>
         <tr
            v-for="(tResult) in tResults"
            :key="tResult.recno"
         >
            <td>{{ formatDate(tResult.publishedOn) }}</td>
            <td>{{ tResult.title }}</td>
         </tr>
      </tbody>
   </table>
</template>

<script>
   import * as utils from "../../../../shared/utils.js";
   export default {
      props: {
         tResults: { type: Array, default: () => []},
         stickyTop: 0
      },
      methods: {
         formatDate (dtIn) {
            return utils.formatDate(dtIn)
         }
      }
   };
</script>


