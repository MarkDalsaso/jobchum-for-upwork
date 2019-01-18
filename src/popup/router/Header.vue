<template>
   <header>
      <h2 class="title">
         jobMonkey
         <span class="smaller">for Upwork</span>
      </h2>
      <span>
         <img src="../../assets/jm128.png" height="55px">
         <p>
            ver. {{ version }}
            <span v-if="devMode" style="color: red;">(dev)</span>
         </p>
      </span>
      <nav>
         <div>
            <router-link
               to="/"
               tag="button"
               class="btn1"
               active-class="active"
               exact
            >Topics</router-link>
            <router-link
               to="/settings"
               tag="button"
               class="btn1"
               active-class="active"
            >Settings</router-link>
            <router-link
               to="/tools"
               tag="button"
               class="btn1"
               active-class="active"
            >Tools</router-link>
         </div>
      </nav>
   </header>
</template>

<script>
   import * as utils from "../../shared/utils.js";
   export default {
      data() {
         return {};
      },
      computed: {
         version() {
            let manifest = browser.runtime.getManifest();
            return manifest.version;
         },
         devMode() {
            return utils.devMode;
         }
      }
   };
</script>

<style scoped>
   header {
      height: 85px;
      position: fixed;
      top: 0;
      width: 100%;
      overflow: hidden;
      background: rgb(246, 232, 181);
      /* border: solid 1px rgb(141, 141, 141); */
   }

   header > h2 {
      text-align: center;
      margin: 0 0 5px 0;
   }

   header > span {
      padding: 6px;
      z-index: 10;
      position: absolute;
      top: 0; right: 0;
      font-size: 75%;
   }

   header > span > p {
      margin: 0;
      line-height: 6px;
   }

   nav {
      position: relative;
      height: 40px;
      border-radius: 5px;
      background-color: rgba(32, 31, 25, 0.068);
   }

   nav > div {
      margin: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
   }

   nav > div > button.btn1 {
      color: black;
      margin: 0 14px;
      background-color: rgb(221, 209, 192);
   }

   nav > div button.btn1:hover,
   nav > div button.btn1.active,
   nav > div button.btn1.hover > input[type] {
      background-color: rgb(255, 237, 209);
   }
</style>