<template>
   <div v-if="stateIsReady" style="max-width:450px">
      <router-view name="header-top"></router-view>
      <router-view></router-view>
   </div>
</template>

<script>
   import * as utils from "../shared/utils";
   export default {
      data () { return { 
         auxilaryRoute: false }
      },
      created() {
         this.handleAuxilaryRoute()
      },
      methods: {
         handleAuxilaryRoute () {
            let queryString = window.location.search;
            if (queryString.length > 1) {
               let qsAry = queryString.split("&")
               if (
                     qsAry[0].startsWith("?p=") && 
                     qsAry[0].split("=").length > 1
                  ) {
                     let path = qsAry[0].split("=")[1]
                     this.auxilaryRoute =  true;
                     this.$router.replace({ path: '/' + path + queryString})
                     // default html title
                     document.title = 
                        "jC - " + path.charAt(0).toUpperCase() + path.slice(1);
               }
               //console.log("querystring: " + queryString)   // Testing
            }
         }
      },
      computed: {
         stateIsReady() {
         // NOTE: This, and store.dispatch('loadStateFromStorage') in
         //        popup.js, eliminates ALL undefined state property errors
            return this.$store.state.initialized
         },
         settings () {
            return this.$store.getters.settings
         },         
      },
      watch: {
         stateIsReady: function (isReady) {
            if (isReady && !this.auxilaryRoute) {
               this.$router.replace({ path: '/' + this.settings.ui.auto.topicsFilter });
            }
         }
      },
   };

   window.onunhandledrejection = (event => {
     console.log(event.type);
     console.log(event.reason.message);
   })
   
</script>

 <style>
    html, body {
      margin: 0;
      padding: 0;
      color: #000;
      background-color: rgb(246, 232, 181);
      font-family: "Segoe UI", Tahoma, Arial, Helvetica, sans-serif;
      font-size: 1em;
   }
   header {
      background-color: rgb(246, 232, 181);
      position: fixed;
      top: 0;
      width: 100%;
      overflow: hidden;
      z-index: 10;
   }
   .title {
      position: relative;
      text-align: center;
      margin: 0 0 5px 0;
   }
   .panel {
     min-width: 425px;
     min-height: 900px;  /* ensures vertical scrollbar */
   }
   .nav-icon {
      display: inline-block;
      vertical-align: bottom;
      height: 25px;
      margin: 5px 5px 0 5px;
   }    
   .btn1 {
      color: black;
      display: inline-block;
      font-weight: 650;
      font-size:  13px;
      font-family: inherit;
      border-radius: 5px;
      outline: none;
      box-sizing: border-box;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
   }
   .btn1:hover,
   .btn1:active,
   .btn1:hover > input[type] {
      cursor: hand;
      cursor: pointer;
      border-radius: 5px;
      outline: none;
   }
   .btn1 > label:hover {
      cursor: hand;
      cursor: pointer;
   }
   .tbl-sticky-hdr {
      width: 100%;
      border-spacing: 0;
      padding-bottom: 4px;
   }

   .tbl-sticky-hdr thead th {
      position: sticky;
      position: -webkit-sticky;
      z-index: 5;
      background-color: rgb(232, 219, 170);
   }
   .tbl-sticky-hdr.alt-rows tr:nth-child(even) {
       background-color: rgb(232, 219, 170);
   }
</style>