import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import routes from './modules/routes.module';
import data from './modules/data.module';
import user from './modules/user.module';
import user_companies from './modules/user-companies.module';
import posts from './modules/posts.module';
import notifications from './modules/notifications.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      auth,
      routes,
      data,
      user,
      user_companies,
      posts,
      notifications      
   }
});
