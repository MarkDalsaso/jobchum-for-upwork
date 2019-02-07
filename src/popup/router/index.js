// NOTE: by convention "index.js" is the default (used by npm and webpack)
//       entry point for a folder/directory. So this file "index.js" becomes
//       "router" as imported into in "popup.js"

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

// Instantiate "new" router instance, assignin routes
export default new VueRouter({
   routes,
   mode: 'history', // may not work 
   scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }   
});
