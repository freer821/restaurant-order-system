import Vue from 'vue';
import Router from 'vue-router';

import home from './home';
import order from './order';
import login from './login';
import user from './user';

Vue.use(Router);

const RouterModel = new Router({
  routes: [...order,...home,...login,...user]
});

RouterModel.beforeEach((to, from, next) => {
  next();
});

export default RouterModel;
