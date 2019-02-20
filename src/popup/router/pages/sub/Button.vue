<template>     
   <button :class="[colorClass]" @click="onClick">
      <img v-if="iconSrc" :src="iconSrc">
      <span>
         <slot></slot>
      </span>
   </button>
</template>

<script>
   export default {
      //data () { return { } },
      props: {
         onClick: { type: Function, required: true },
         iconSrc: { type: String, required: false },
         colorClass: { type: String, required: false, default: '' }
      }
   }
</script>

<style scoped>
   button {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      height: 28px;
      color: black;
      padding: 3px 4px;
      margin-right: 10px;
      /* line-height: 100%; */
      font-size:  13px;
      font-weight: 650;
      font-family: inherit;
      border-style: none;
      border-radius: 5px;
      /* box-sizing: border-box; */
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
   }
   button > img, button > span {
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      line-height: 22px;
   }
   .hdr-clr {
      background-color: rgb(221, 209, 192);
   }
   .hdr-clr:hover,
   .hdr-clr:active,
   .hdr-clr.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }
   .tpc-clr {
      background-color: rgba(235, 239, 245, 0.5);
   }
   .tpc-clr:hover,
   .tpc-clr:active,
   .tpc-clr.hover > input[type] {
      background-color: rgba(231, 235, 240, 0.87);
   }   
</style>