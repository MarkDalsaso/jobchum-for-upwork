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
         onClick: { type: Function, required: false, default: function () {} },
         iconSrc: { type: String, required: false },
         colorClass: { type: String, required: false, default: '' }
      }
   }
</script>

// usage
/*
   <!-- e.g. icon img only -->
   <!--
      <v-btn :onClick="openNotificationsReport"
         :iconSrc="toolsIcon"
         :colorClass="'hdr-clr'"
      ></v-btn>
   -->

   <!-- e.g. button text only -->
   <!--
      <v-btn :onClick="openNotificationsReport">
         No Img
      </v-btn>
   -->

   <!-- e.g. icon img and button text -->
   <!--
      <v-btn :onClick="openNotificationsReport"
         :iconSrc="reportsIcon"
         :colorClass="'hdr-clr'"
         style="margin-left: 16px"
      >
         Notifications Log
      </v-btn>
   -->
*/