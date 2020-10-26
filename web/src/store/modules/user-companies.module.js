import CompaniesService from '@/services/companies.service';
import { FETCH_USER_COMPANIES, CREATE_USER_COMPANY, STORE_USER_COMPANY,
EDIT_USER_COMPANY, UPDATE_USER_COMPANY, DELETE_USER_COMPANY, TOP_USER_COMPANY,
ORDERS_USER_COMPANY } from '@/store/actions.type';
import { SET_LOADING, SET_USER_COMPANIES, CLEAR_ERRORS } from '@/store/mutations.type';

 
const state = {
   list: [],
};

const getters = {
   
};

const actions = {
   [FETCH_USER_COMPANIES](context) {
      return new Promise((resolve, reject) => {
         CompaniesService.fetch()
         .then(companies => {
            context.commit(SET_USER_COMPANIES, companies);
            resolve(companies);
         })
         .catch(error => {
            reject(error);
         })
      })
   },
   [CREATE_USER_COMPANY](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.create()
         .then(model => {
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   },
   [STORE_USER_COMPANY](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.store(model)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   },
   [EDIT_USER_COMPANY](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.edit(id)
         .then(model => {
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   },
   [UPDATE_USER_COMPANY](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.update(model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   },
   [DELETE_USER_COMPANY](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.remove(id)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   },
   [TOP_USER_COMPANY](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.top(id)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   },
   [ORDERS_USER_COMPANY](context, models) {
      
      console.log(ORDERS_USER_COMPANY, models);
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CompaniesService.orders(models)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
      })
   }
};


const mutations = {
   [SET_USER_COMPANIES](state, companies) {
      state.list = companies;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 