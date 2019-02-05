<template>
   <div v-if="stateIsReady" style="max-width:450px">
      <popup-header></popup-header>
      <router-view></router-view>
   </div>
</template>

<script>
   import Header from "./router/Header.vue";
   export default {
      computed: {
         stateIsReady() {
         // NOTE: This (along w. store.dispatch('initState') in popup.js),
         //        eliminates ALL undefined state property errors
            return this.$store.state.initialized;
         },
      },
      components: { popupHeader: Header }
   };

   window.onunhandledrejection = (event => {
     console.log(event.type);
     console.log(event.reason.message);
   })
   
</script>

 <style>
   html, body {
      min-height: 900px;   /* ensures vertical scrollbar */
      margin: 0;
      padding: 0;
      color: #000;
      background: rgb(246, 232, 181);
      font-family: "Segoe UI", Tahoma, Arial, Helvetica, sans-serif;
      font-size: 1em;
   }

   .panel {
     min-width: 425px;
     margin-top: 84px;
   }

   .panel h4 {
      text-align: center;
      margin: 0
   }

   section {
      margin: 6px;
      padding-top: 2px;
      border-radius: 3px;
   }

   section > table {
      width: 100%;
      table-layout: fixed;
   }

   .sub-panel {
      background-color: rgb(181, 206, 246);
   }

   #vueMain {
      position: relative;
   }

   img.gear {
      padding: 0 0 0 35px;
      vertical-align: bottom;
      width: 24px;
   }

   .btn1 {
      display: inline-block;
      font-weight: 650;
      font-size:  13px;
      font-family: inherit;
      padding: 4px;
      /* background-color: rgb(205, 220, 243); */
      background-color: rgba(235, 239, 245, 0.5);
      /* border: solid 1px rgb(187, 187, 187); */
      border-radius: 5px;
      outline: none;
      box-sizing: border-box;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
   }

   .btn1 > input[type="checkbox"] {
      margin: 0 3px 0 4px
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
      /* background-color: rgb(226, 239, 248); */
      /* border: solid 1px rgb(168, 168, 168); */
      cursor: hand;
      cursor: pointer;
      border-radius: 5px;
      outline: none;
   }

   .btn1 > label:hover {
      cursor: hand;
      cursor: pointer;
   }

   .settings-brown {
      display: none; /* note default is to hide settings panel */
      background-color: rgb(207, 196, 149);
   }

   section.settings-brown.show {
      display: block;
   }

   .settings .btn1:hover,
   .settings .btn1:active,
   .settings .btn1:hover > input[type] {
      background-color: rgb(255, 237, 209);
   }

</style>
