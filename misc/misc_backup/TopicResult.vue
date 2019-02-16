<template>
   <span>
      <span>{{ publishedDate }}</span>
      <span>{{ tResult.title }}</span>
   </span>
</template>

<script>
   export default {
      props: {
         tResult: {
            type: Object,
            default: {}
         }
      },
      computed: {
         publishedDate() {
            let dtMilli = Date.parse(this.tResult.publishedOn)
            let dt = new Date(dtMilli)
            let formattedDate = dt.toLocaleString()
            return formattedDate
         }
      }
   }
</script>

<style scoped>

</style>