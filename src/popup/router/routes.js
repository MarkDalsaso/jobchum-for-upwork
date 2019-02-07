// This file contains the route (or page), to component mappings. Each
// path requires a vue component, which must be referenced (note imports)

import TopicsPage from './pages/Topics';
import Header from './Header';
import SettingsPage from './pages/Settings';
import ToolsPage from './pages/Tools';
import ReportsPage from './pages/Reports';

export default [
   { 
     path: '/settings',
     components: {
         default: SettingsPage,
         'header-top': Header
     }
   },
   { 
      path: '/tools',
      components: {
         default: ToolsPage,
         'header-top': Header
     }       
   },
   { 
      path: '/reports',
      components: {
         default: ReportsPage
     }  
   },   
   {
      path: '/:filter',
      components: {
         default: TopicsPage,
         'header-top': Header
      }
   }

   /*
   {path: '/reports', component: ReportsPage, children: [
      { path: 'topic-results:topicId', component: TopicResultsReport },
      { path: 'notification-log', component: NotificationLogReport }
   ]}
   */
];