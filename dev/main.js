import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify - remover dependência
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({}),
  router,
  render: h => h(App)
}).$mount("#app");
