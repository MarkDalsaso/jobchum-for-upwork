/*
      Process topic json sent from xhr monkey patch
      
*/

import store from '../../store'

export default function (topics) {
   store.dispatch('loadTopics', topics);
}