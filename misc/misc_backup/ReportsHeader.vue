<template>
   <header :style="{ height: hdrInfo.fixedHeight +'px' }" >
      <h2 class="title">{{ hdrInfo.titlePrefix + rptInfo.title }}</h2>
   </header>
</template>

<script>
   // import * as utils from "../../shared/utils.js"
   export default {
      props: {
         hdrInfo: {
            type: Object,
            default: { fixedHeight: 0, titlePrefix: "jC - " }
         },
         rptInfo: {
            type: Object, 
            default: { name: '', title: '' }
         }
      },
      created () {
         document.title = 
            this.hdrInfo.titlePrefix + this.rptInfo.title
      }
   }
</script>