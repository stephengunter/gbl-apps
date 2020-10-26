import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';

const getMainMenus = (appRoutes, currentRoute, user = null) => {
   let mainLinks = getMainLinks(appRoutes, user);
   mainLinks.forEach(item => {
      item.active = (item.name === currentRoute.name);
   });

   return mainLinks;
}

const getUserMenus = (appRoutes, currentRoute, user) => {
   return getUserLinks(appRoutes, user);
}

const getFooterMenus = (appRoutes, currentRoute, user) => {
   return getFooterLinks(appRoutes, user);
}


const getMainLinks = (routes, user = null) => routes.filter(item => {
   let menus = item.meta.menus;
   if(menus && menus.length) {
      let mainMenu = menus.find(x => x.key === 'main');
      if(!mainMenu) return false;

      if(user) {
         return mainMenu.show !== GUEST_ONLY;
      }else {
         return mainMenu.show !== USER_ONLY;
      }
      
   }
   return false;
});

const getUserLinks = (routes, user) => routes.filter(item => {
   let menus = item.meta.menus;
   if(menus && menus.length) {
      let userMenu = menus.find(x => x.key === 'user');
      if(!userMenu) return false;

      return userMenu.show !== GUEST_ONLY;
      
   }
   return false;
});

const getFooterLinks = (routes, user = null) => routes.filter(item => {
   let menus = item.meta.menus;
   if(menus && menus.length) {
      let footerMenu = menus.find(x => x.key === 'footer');
      if(!footerMenu) return false;

      if(user) {
         return footerMenu.show !== GUEST_ONLY;
      }else {
         return footerMenu.show !== USER_ONLY;
      }
      
   }
   return false;
});


const getSubLinks = (routes, parent) => routes.filter(item => item.parent === parent);

export default { getMainMenus, getUserMenus, getFooterMenus };
