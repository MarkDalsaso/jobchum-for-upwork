<template>
   <div class="bar">
      <div class="inner-bar" :style="{width: width + '%'}">
         {{value + '%'}}
      </div>
   </div>
</template>

<script>
   export default {
      data: function() {
         return { width: 0 };
      },
      props: {
         value: { type: Number, default: 0 }
      },
      mounted () {
         let self = this
         setInterval(function () {
            self.width = self.value;
         }, 250)
      }
   };
</script>

<style scoped>
   .bar {
      width: 100%;
      height: 20px;
      background-color: #aaa;
      margin: auto;
      text-align: center;
   }
   .inner-bar {
      background-color:rgb(55, 160, 0);;
      margin: 0;
      color: white;
      transition: width 250ms;
   }
</style>

