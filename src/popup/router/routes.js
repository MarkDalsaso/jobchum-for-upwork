// This file contains the route (or page), to component mappings. Each
// path requires a vue component, which must be referenced (note imports)

import TopicsPage from './pages/Topics';
import SettingsPage from './pages/Settings';
import ToolsPage from './pages/Tools';

export default [
   { path: '/settings', component: SettingsPage },
   { path: '/tools', component: ToolsPage },
   { path: '/:filter', component: TopicsPage },
   { path: '/', component: TopicsPage }
];