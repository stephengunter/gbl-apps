import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';
import { INIT, GO_TO_PAGE, LOAD_BREAD } from '@/store/actions.type';
import { SET_ROOT_CATEGORY, SET_CATEGORY, SET_BREAD_ITEMS,
   SET_CURRENT_PAGE, SET_MENUS, SET_FOOTER_MENUS, SET_USER_MENUS
} from '@/store/mutations.type';
import { SITE_TITLE } from '@/config';

const getMainMenus = (appRoutes, currentRoute, user = null) => {
   let mainLinks = getMainLinks(appRoutes, user);
   mainLinks.forEach(item => {
      item.active = (item.name === currentRoute.name);
   });

   return mainLinks;
}

const getUserMenus = (appRoutes, currentRoute, user) => {
   let links = getUserLinks(appRoutes, user);
   let groups = [];
   links.forEach(item => {
      let group = groups.find(x => x.key === item.parent);
      if(group) {
         group.items.push(item);
      }else {
         let parent = appRoutes.find(x => x.name === item.parent);
         groups.push({
            key: parent.name, title: parent.meta.title, items: [item]
         })
      }
   });
   return groups;
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


const initialState = {
   router: null,
   currentPage: null,
   pageTitles: [],
   menus: [],
   footerMenus: [],
   userMenus: [],
   rootCategory: null,
   category: null
};

export const state = { ...initialState };


const getters = {
   router(state) {
      return state.router
   },
   routes(state) {
      if(state.router) return state.router.options.routes;
      return [];
   },
   currentPage(state) {
      return state.currentPage;
   },
   parentPage(state) {
      if(state.router) {
         if(state.currentPage && state.currentPage.parent) {
            return state.router.options.routes.find(x => x.name === state.currentPage.parent);
         }
      }
      return routes;
   },
   pageTitles(state) {
      return state.pageTitles;
   },
   menus(state) {
      return state.menus;
   },
   userMenus(state) {
      return state.userMenus;
   },
   footerMenus(state) {
      return state.footerMenus;
   },
   rootCategory(state) {
      return state.rootCategory;
   },
   category(state) {
      return state.category;
   }
};

const actions = {
   [INIT](context, { router, to }) {
      context.state.router = router;

      let user = context.getters.currentUser;
      let routes = router.options.routes;

      let page = routes.find(x => x.name === to.name);
      let parents = [];
      let rootCategory = null;
      if(page.parent) {
         let parentPage = routes.find(x => x.name === page.parent);
         while(parentPage) {
            parents.unshift(parentPage);
            if(parentPage.parent) parentPage = routes.find(x => x.name === parentPage.parent);
            else parentPage = null;            
         }
         rootCategory = context.getters.categories.find(x => x.name === page.parent);
         
      }else {
         rootCategory = context.getters.categories.find(x => x.name === page.name);
      }

      page.parents = parents;
      
      context.commit(SET_CURRENT_PAGE, page);
      context.commit(SET_ROOT_CATEGORY, rootCategory);
      

      let mainMenus = getMainMenus(routes, to, user);
      context.commit(SET_MENUS, mainMenus);

      // let footerMenus = Menu.getFooterMenus(router.options.routes, to, user);	
	   // store.commit(SET_FOOTER_MENUS, footerMenus);

      if(user) {
         let userMenus = getUserMenus(routes, to, user);
         context.commit(SET_USER_MENUS, userMenus);
      }
      
   },
   [LOAD_BREAD](context) {
      let currentPage = context.getters.currentPage;
      let items = currentPage.parents.map(page => ({
         action: page.path , text: page.getTitle()
      }));
      items.push({
         action: '' , text: currentPage.getTitle()   
      });
      context.commit(SET_BREAD_ITEMS, items);
   },
   [GO_TO_PAGE](context, { path = '', name = '' }) {
      let currentPage = context.getters.currentPage;
      console.log('path', path);
      console.log('name', name);

      console.log('currentPage', currentPage);
   }
}



const mutations = {
   [SET_CURRENT_PAGE](state, page) {
      state.currentPage = page;

      let titles = page.parents.length ? page.parents.map(x => x.getTitle()) : [];
      titles.push(page.getTitle());

      state.pageTitles = titles;

      let documentTitle = SITE_TITLE;
      for(let i = 0; i < titles.length; i++) {
         if(i === 0) documentTitle += ' - ';
         else documentTitle += ' > ';
         documentTitle += titles[i];
      }
      document.title = documentTitle;
   },
   [SET_MENUS](state, menus) {
      menus.sort((a, b) => {
         let menuA = a.meta.menus.find(x => x.key === 'main');
         let menuB = b.meta.menus.find(x => x.key === 'main');

         if(menuA.order > menuB.order) return 1;
         if(menuB.order > menuA.order) return -1;
         return 0;
      })
      state.menus = menus;
   },
   [SET_FOOTER_MENUS](state, footerMenus) {
      state.footerMenus = footerMenus;
   },
   [SET_USER_MENUS](state, userMenus) {
      state.userMenus = userMenus;
   },
   [SET_ROOT_CATEGORY](state, category) {
      if(category) state.rootCategory = category;
      else state.rootCategory = null;
   },
   [SET_CATEGORY](state, category) {
      if(category) state.category = category;
      else state.category = null;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 