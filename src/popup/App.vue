<template>
   <div v-if="stateIsReady" style="max-width:450px;">
      <router-view name="header-top"></router-view>
      <transition name="fade" mode="out-in">
         <router-view/>
      </transition>
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
                        "jobChum - " + path.charAt(0).toUpperCase() + path.slice(1);
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
   ::-webkit-scrollbar {
      width: 14px;
      background-color: inherit;
   }
   ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      border-radius: 10px;
   }
   ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
      background: linear-gradient(to bottom,rgb(221, 209, 192),rgb(246, 232, 181));
      
   }
   .fade-enter-active, .fade-leave-active {
      transition-duration: 0.3s;
      transition-property: opacity;
      transition-timing-function: ease;
   }
   .fade-enter, .fade-leave-active {
      opacity: 0
   }
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
      height: 34px;
      position: relative;
      text-align: center;
      margin: 0;
      padding: 2px
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
   input[type="number"] {
      width: 35px;
      height: 28px;
      border-radius: 5px;
      border-style: none;
      margin: 0 0 0 4px;
      border: none;
      padding: 0 3px;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25);
   }
   
   input[type=number] { 
      -moz-appearance: textfield;
      appearance: textfield;
   }
   input[type=number]::-webkit-inner-spin-button, 
   input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
   }
   .hdr-clr {
      background-color: rgb(221, 209, 192);
   }
   .hdr-clr.active,
   .hdr-clr:hover,
   .hdr-clr:active,
   .hdr-clr.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }
   .tpc-clr {
      background-color: rgba(235, 239, 245, 0.5);
   }
   .tpc-clr.active,
   .tpc-clr:hover,
   .tpc-clr:active,
   .tpc-clr.hover > input[type] {
      background-color: rgba(231, 235, 240, 0.87);
   }

   /*     button styling       */
   button {
      position: relative;
      box-sizing: border-box;
      line-height: 1.2;
      top: 50%;
      transform: translateY(-50%);
      color: black;
      padding: 3px 4px;
      margin-right: 10px;
      font-size:  13px;
      font-weight: 650;
      font-family: inherit;
      border-style: none;
      border-radius: 5px;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
   }
   button:focus {
      outline-style: none
   }
   button > img, button > span {
      height: 100%;
      display: inline-block;
      vertical-align: middle;
      line-height: 22px;
   }

   /*
      Shared reports table styling. 'rpt-tbl' class
      used in both Reports.vue and Topicresults.vue
   */
   .rpt-tbl {
      width: 100%;
      border-collapse: collapse;
   }
   .rpt-tbl td {   
      padding: 5px;
   }
   .rpt-tbl thead, .rpt-tbl th {
      position: sticky;
      top: 38px;
      background-color: rgb(232, 219, 170);
   }

/*     misc util styling       */
.flt-rgt {
   float: right
}

</style>