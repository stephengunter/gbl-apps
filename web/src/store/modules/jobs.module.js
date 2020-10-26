import PostsService from '@/services/posts.service';
import { CREATE_JOB, STORE_JOB } from '@/store/actions.type';
import { SET_LOADING, SET_POSTS, SET_POST_MODEL } from '@/store/mutations.type';

 
const state = {
   pagedList: null,
   model: null
};

const getters = {
   
};


const actions = {
   [FETCH_POSTS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PostsService.fetch(params)
         .then(model => {
            context.commit(SET_POSTS, model);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => {
            context.commit(SET_LOADING, false);
         });
      })
   },
   [CREATE_POST](context) {
      return new Promise((resolve, reject) => {
         PostsService.create()
         .then(model => {
            resolve(model);
         })
         .catch(error => {
            reject(error);      
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      })
   },
   [STORE_POST](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PostsService.store(model)
         .then(notice => {
            resolve(notice);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      })
   },
   [EDIT_POST](context, id) {
      return new Promise((resolve, reject) => {
         PostsService.edit(id)
         .then(model => {
            resolve(model);
         })
         .catch(error => {
            reject(error);        
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      })
   },
   [UPDATE_POST](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PostsService.update(model.id, model)
         .then(post => {
            resolve(post);
         })
         .catch(error => {
            reject(error); 
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      })
   },
   [DELETE_POST](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PostsService.remove(id)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      })
   }   
   
};


const mutations = {
   [SET_POSTS](state, model) {
      state.pagedList = model;
   },
   [SET_POST_MODEL](state, model) {
      if(model) state.model = model;
      else state.model = null;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 