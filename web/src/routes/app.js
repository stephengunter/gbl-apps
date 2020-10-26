import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';

const applinks = [{
   name: 'home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'main', show: FOR_ALL, order: 0
      }],
      icon: 'mdi-home',
      title: '首頁'
   } 
}];

const userLinks = [{
   name: 'user',
   path: '',
   view: '',
   parent: '',
   meta: {
      type: USER_ONLY,
      menus: [],
      icon: '',
      title: '我的'
   } 
},{
   name: 'user-companies',
   path: '/user/companies',
   view: 'user/Companies',
   parent: 'user',
   meta: {
      type: USER_ONLY,
      menus: [{
         key: 'user', show: USER_ONLY
      }],
      icon: 'mdi-briefcase',
      title: '公司資訊'
   } 
},{
   name: 'user-posts',
   path: '/user/posts',
   view: 'user/Posts',
   parent: 'user',
   meta: {
      type: USER_ONLY,
      menus: [{
         key: 'user', show: USER_ONLY
      }],
      icon: 'mdi-newspaper-variant-multiple-outline',
      title: '張貼紀錄'
   } 
}];

const guestLinks = [{
   name: 'login',
   path: '/login',
   view: 'Login',
   meta: {
      type: GUEST_ONLY,
      menus: [{
         key: 'main', show: GUEST_ONLY, order: 6
      }],
      icon: 'mdi-login-variant',
      title: '登入',
      menu: true
   } 
}];

let appRoutes = applinks.concat(userLinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;