import { createApp } from 'vue' // Импорт метода для создания приложения
import App from './App.vue' // Импорт главного компонента
import router from './router' // Маршрутизация
import store from './store';
import 'bootstrap/dist/css/bootstrap.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faIcons, faClipboardUser, faChartLine } from '@fortawesome/free-solid-svg-icons'

library.add(faUser);
library.add(faIcons);
library.add(faClipboardUser);
library.add(faChartLine);

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
.use(router).use(store).mount('#app');