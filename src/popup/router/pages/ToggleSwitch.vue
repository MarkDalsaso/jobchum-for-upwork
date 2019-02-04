<template>
   <div class="toggle" :class="[state_class]" @click.self="onClick">
      <div class="draggable" @mousedown.prevent="dragStart" :style="style">
         <span>{{ stateText }}</span>
      </div>
   </div>
</template>

<script>
   export default {
      props: {
         value: { type: Boolean, default: true },
      },
      data() {
         return {
            width: 100,
            state: false,
            pressed: 0,
            position: 0,
            stateText: "off"
         };
      },
      mounted() {
         this.toggle(this.value);
      },
      computed: {
         style() {
            return {
               transform: `translateX(${this.pos_percentage})`
            };
         },
         pos_percentage() {
            return `${(this.position / this.width) * 100}%`;
         },
         state_class() {
            if (this.state) {
               return "active";
            }
         }
      },
      watch: {
         position() {
            this.state = this.position >= 50;
         },
      },
      methods: {
         onClick() {
            this.toggle(!this.state);
            this.emit();
         },
         toggle(state) {
            this.state = state;
            this.position = !state ? 0 : 100;
            state ? this.stateText = "on" : this.stateText = "off"
         },
         dragging(e) {
            const pos = e.clientX - this.$el.offsetLeft;
            const percent = (pos / this.width) * 100;
            this.position = percent <= 0 ? 0 : percent >= 100 ? 100 : percent;
         },
         dragStart(e) {
            this.startTimer();
            window.addEventListener("mousemove", this.dragging);
            window.addEventListener("mouseup", this.dragStop);
         },
         dragStop() {
            window.removeEventListener("mousemove", this.dragging);
            window.removeEventListener("mouseup", this.dragStop);
            this.resolvePosition();
            clearInterval(this.$options.interval);
            if (this.pressed < 30) {
               this.toggle(!this.state);
            }
            this.pressed = 0;
            this.emit();
         },
         startTimer() {
            this.$options.interval = setInterval(() => {
               this.pressed++;
            }, 1);
         },
         resolvePosition() {
            this.position = this.state ? 100 : 0;
         },
         emit() {
            this.$emit("input", this.state);
         }
      }
   }
</script>

<style scoped>
   .toggle {
      width: 40px;
      height: 20px;
      /* background: #fff; */
      background: rgb(218, 223, 232);
      border: 1px solid #ddd;
      border-radius: 200px;
      padding: 1px;
      transition: #fff 0.6s;
      cursor: hand;
      cursor: pointer;      
   }
   .toggle > .draggable {
      width: 20px;
      height: 20px;
      background: #ddd;
      border-radius: 100%;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.6);
      transform: translateX(0%);
      transition: transform 0.05s ease-in-out;
      cursor: inherit;
   }
   .toggle > .draggable > span {
      font-size: 12px;
      position: relative;
      float: left;
      top: 45%;
      left: 49%;
      transform: translate(-50%, -50%);
      cursor: inherit;
   }
   .toggle.active {
      background: rgb(55, 160, 0);
      transition: #fff 0.6s;
   }
   section.grey-out .toggle.active {
      background: rgb(218, 223, 232);  
   }
</style>