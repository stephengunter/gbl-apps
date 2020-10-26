import Vue from 'vue';
window.Bus = new Vue({});

import App from './App.vue';
import { initRouter } from './routes';
import store from './store';

import vuetify from './plugins/vuetify';
import '@/plugins';
import '@/components';
import DataService from '@/services/data.service';
import { SET_CITIES, SET_CATEGORIES } from '@/store/mutations.type';

Vue.config.productionTip = false;

DataService.fetch()
.then(model => {
	launchApp(model);
})
.catch(error => {
	console.error(error);
	launchApp();
})

const launchApp = (model = null) => {
	let categories = [];
	if(model && model.categories.length) categories = model.categories;
	
	let cities = [];
	if(model && model.cities.length) cities = model.cities;

	new Vue({
		router: initRouter(categories),
		store,
		vuetify,
		created() {
			this.$store.commit(SET_CITIES, cities);
			this.$store.commit(SET_CATEGORIES, categories);
		},
		render: h => h(App)
	}).$mount('#app')
}