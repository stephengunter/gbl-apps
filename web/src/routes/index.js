import Vue from 'vue';
import Router from 'vue-router';
import appRoutes from './app';

import store from '@/store';
import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';
import JwtService from '@/services/jwt.service';
import { INIT, CHECK_AUTH, REFRESH_TOKEN, FETCH_ACTIONS } from '@/store/actions.type';
import { SET_AUTH_CHANGED } from '@/store/mutations.type';
import { CREATE_TEXT } from '@/consts';


// const originalPush = Router.prototype.push;

// Router.prototype.push = function push(location, onResolve, onReject) {
// 	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
// 	return originalPush.call(this, location).catch(err => err)
// }

// const originalReplace = Router.prototype.replace
// Router.prototype.replace = function repalce(location, onResolve, onReject) {
// 	if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
// 	return originalReplace.call(this, location).catch(err => err)
// }

Vue.use(Router);


var router = null;

const redirect = (next, route) => next(route);

const authDone = (next, to, user = null) => {
	store.dispatch(INIT, { router, to });
	//store.dispatch(FETCH_ACTIONS, to);
	return next();
}

const refreshToken = (next, to) => {
	store.dispatch(REFRESH_TOKEN)
	.then(token => {	
		if(token) return redirect(next, { path: to.path });
		else {
			let query = { ...to.query, returnUrl: to.path };
			return redirect(next, { path: '/login', query });
		}
	})
}

const loadRoutes = (categories) => {
	for(let i = 0; i < categories.length; i++) {
		let item = categories[i];
		let route = {
			name: item.name,
			path: item.path,
			view: item.view,
			parent: '',
			meta: {
				type: FOR_ALL,
				menus: [{ key: 'main', show: FOR_ALL, order: i + 1 }],
				icon: item.icon,
				title: item.title
			},
			subItems: []
		};
		if(item.subItems && item.subItems.length) {
			route.subItems = item.subItems.map(sub => {
				return {
					id: sub.id,
					name: sub.name,
					title: sub.title,
					path: sub.path,
					view: sub.view,
					icon: sub.icon,
					parent: item.name
				}
			});
		}
		let routeCreate = {
			name: `${item.name}-create`,
			path: `${item.path}/create`,
			view: 'posts/Create',
			parent: item.name,
			meta: {
				type: USER_ONLY,
				menus: [],
				icon: '',
				title: CREATE_TEXT
			},
			subItems: []
		};
		appRoutes.push(route);
		appRoutes.push(routeCreate);

	} //end for loop

	return appRoutes;
}

export const initRouter = (categories = []) => {
	let routes = loadRoutes(categories);

	routes.push({
		path: '*', redirect: '/',
		meta: {}      
	});

	routes.forEach(item => {
		item.getTitle = () => item.meta.title;
		if(item.view) {
			item.component = (resolve) => import(
				`@/views/${item.view}.vue`
			).then(resolve)
		}else {
			item.redirect = '/'
		} 
	});
	router = new Router({
		routes,
		mode: 'history',
		scrollBehavior (to, from, savedPosition) {
			if (savedPosition) {
			  return savedPosition
			}
			if (to.hash) {
			  return { selector: to.hash }
			}
			return { x: 0, y: 0 }
		}
	});

	router.beforeEach((to, from, next) => {
		store.dispatch(CHECK_AUTH).then(user => {
			if(user) {
				if(store.getters.authChanged) {
					store.commit(SET_AUTH_CHANGED, false);
					return refreshToken(next, to);
				}else {
					let tokenStatus = JwtService.tokenStatus();
					if(tokenStatus === -1) {
						//token過期
						return refreshToken(next, to);
					}else if(tokenStatus === 0) {
						//token 即將到期
						return refreshToken(next, to);
					}else {
						//token正常
						if(to.meta.type === GUEST_ONLY) return redirect(next, { path: '/' });
						else return authDone(next, to, user);
					}
				}
			}else{
				//無token
				if(to.meta.type === FOR_ALL || to.meta.type === GUEST_ONLY) return authDone(next, to, user);
				else {
					let query = { ...to.query, returnUrl: to.path };
					return redirect(next, { path: '/login', query });
				} 
			}
		})
	})

	return router;
}
