import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as VueGoogleMaps from "vue2-google-maps";

import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBcIHo69ys0ZGa-1J-NZFlLmKCEPESjvBQ",
  },
  installComponents: true,
});
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
