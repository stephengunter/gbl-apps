import DataService from '@/services/data.service';
import { FETCH_DATA } from '@/store/actions.type';

import { SET_CITIES, SET_CATEGORIES } from '@/store/mutations.type';

 
const state = {
   cities: [],
   categories: []   
};

const getters = {
   cities(state) {
     return state.cities;
   },
   categories(state) {
     return state.categories;
   }
};

const actions = {
   [FETCH_DATA](context) {
      return new Promise((resolve, reject) => {
         DataService.fetch()
         .then(model => {
            context.commit(SET_CITIES, model.cities);
            context.commit(SET_CATEGORIES, model.categories);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
      });   
   }
};


const mutations = {
   [SET_CITIES](state, cities) {
      state.cities = cities;
   },
   [SET_CATEGORIES](state, categories) {
      state.categories = categories;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 