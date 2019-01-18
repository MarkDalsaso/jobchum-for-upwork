<template>
   <div v-cloak>
      <popup-header></popup-header>
      <router-view></router-view>
   </div>
</template>

<script>
   import Header from "./router/Header.vue";
   export default {
      // data() { return {}; },
      components: {
         popupHeader: Header
      }
   };
</script>

 <style>
   body {
      width: 450px;
      min-height: 300px;
      margin: 0;
      padding: 2px;
      color: #000;
      background: rgb(246, 232, 181);
      font-family: "Segoe UI", Tahoma, Arial, Helvetica, sans-serif;
      font-size: 1em;
   }
  
   .panel {
     margin-top: 85px;
   }

   section {
      margin: 8px 4px 8px 4px;
      padding-top: 2px;
      border-radius: 3px;
   }

  section > table {
      width: 100%;
      table-layout: fixed;
   }

   .smaller {
      color: blue;
      font-size: 75%;
      font-style: italic;
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
      font-weight: 600;
      padding: 4px;
      background-color: rgb(205, 220, 243);
      /* border: solid 1px rgb(141, 141, 141); */
      border-style: none;
      border-radius: 5px;
      outline: none;
   }

   .btn1:hover,
   .btn1:active,
   .btn1:hover > input[type] {
      background-color: rgb(226, 239, 248);
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

   .main-alarm-base {
      padding: 4px;
      color: rgb(255, 0, 0);
   }

   .main-alarm-on {
      font-weight: bold;
      color: rgb(0, 128, 0);
   }
</style>
