import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./plugins/pinia";
import vuetify from "./plugins/vuetify";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

library.add(faXmark);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

export const eventBus = new Vue();

new Vue({
  router,
  pinia,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
