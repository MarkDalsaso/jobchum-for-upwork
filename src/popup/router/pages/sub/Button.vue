<template>     
   <button :class="[colorClass, { active: isActive }]" @click="onClick" :style="{height: adjHeight }">
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
         height: { type: Number, default: 28 },
         onClick: { type: Function, required: false, default: function () {} },
         iconSrc: { type: String, required: false },
         colorClass: { type: String, required: false, default: '' },
         isActive: { type: Boolean, required: false, default: false }
      },
      computed: {
         adjHeight () {
            let rtn = this.height + "px"
            if (this.height === 0)
               rtn = "unset"
            return rtn 
         }
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