<template>
   <div class="toggle" :class="[this.state_class]" @click.self="onClick">
      <div class="draggable" @mousedown.prevent="dragStart" :style="style">

      </div>
   </div>
</template>

<script>
   export default {
      props: {
         value: { type: Boolean, default: false }
      },
      data() {
         return {
            width: 100,
            state: false,
            pressed: 0,
            position: 0
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
         }
      },
      methods: {
         onClick() {
            this.toggle(!this.state);
            this.emit();
         },
         toggle(state) {
            this.state = state;
            this.position = !state ? 0 : 100;
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
   body {
      padding: 30px;
   }

   .toggle {
      width: 40px;
      height: 20px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 200px;
      padding: 1px;
      transition: #fff 0.6s;
   }
   .toggle > .draggable {
      width: 20px;
      height: 20px;
      background: #ddd;
      border-radius: 100%;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.6);
      transform: translateX(0%);
      transition: transform 0.05s ease-in-out;
   }

   .toggle.active {
      background: rgb(55, 160, 0);
      transition: #fff 0.6s;
   }

   .app {
      display: flex;
   }

   .switches {
      margin-right: 30px;
   }

   pre {
      margin: 0;
      background: #513d56;
      color: #efefef;
      padding: 20px;
      border-radius: 6px;
      width: 200px;
   }
</style>