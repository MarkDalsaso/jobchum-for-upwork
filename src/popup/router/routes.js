// This file contains the route (or page), to component mappings. Each
// path requires a vue component, which must be referenced (note imports)

import PopupHomePage from './pages/Index';
import SettingsPage from './pages/Settings';
import ToolsPage from './pages/Tools';

export default [
   { path: '/', component: PopupHomePage },
   { path: '/settings', component: SettingsPage },
   { path: '/tools', component: ToolsPage }
];