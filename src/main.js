// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import axios from '../node_modules/axios';
import moment from 'moment';
import BaseNavigation from '@/components/BaseNavigation'
import common from './common/common.js';
import { Tree, Cascader } from 'element-ui';
import 'iview/dist/styles/iview.css';


Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.$moment = moment;

Vue.use(iView);
Vue.component('Navigation', BaseNavigation);
Vue.component(Tree.name, Tree);
Vue.component(Cascader.name, Cascader);
Vue.use(common);




new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
});
