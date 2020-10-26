import NotificationsService from '@/services/notifications.service';

import { FETCH_NOTIFICATION_ITEMS, FETCH_NOTIFICATIONS, 
   CLEAR_NOTIFICATIONS, NOTIFICATION_DETAILS
} from '@/store/actions.type';

import { SET_LOADING, SET_NOTIFICATION_ITEMS,
   SET_NOTIFICATIONS, SET_NOTIFICATIONS_PARAMS, SET_NOTIFICATION
} from '@/store/mutations.type';



const initialState = {
   itemsPagedList: null,
   params: null,
   list: [],
   model: null,
   pagedList: null,
};

export const state = { ...initialState };
 
const getters = {
};


const actions = {
   [FETCH_NOTIFICATION_ITEMS](context) {
      return new Promise((resolve, reject) => {
         NotificationsService.fetch({ page: -1 })
         .then(model => {
            context.commit(SET_NOTIFICATION_ITEMS, model);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
      });
   },
   [FETCH_NOTIFICATIONS](context, params) {
      context.commit(SET_LOADING, true);
      context.commit(SET_NOTIFICATIONS_PARAMS, params);
      
      return new Promise((resolve, reject) => {
         NotificationsService.fetch(params)
         .then(model => {
            context.commit(SET_NOTIFICATIONS, model);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [CLEAR_NOTIFICATIONS](context, ids = []) {
      let model = {
         data: ids.join()
      };
      return new Promise((resolve, reject) => {
         NotificationsService.clear(model)
         .then(model => {
            context.commit(SET_NOTIFICATION_ITEMS, model);
            resolve(true);
         })
         .catch(error => {
            reject(error);        
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [NOTIFICATION_DETAILS](context, id) {
      return new Promise((resolve, reject) => {
         NotificationsService.details(id)
         .then(model => {
            context.commit(SET_NOTIFICATION, model);
            resolve(model);
         })
         .catch(error => {
            reject(error);        
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
};


const mutations = {
   [SET_NOTIFICATION_ITEMS](state, pagedList) {
      if(pagedList) state.itemsPagedList = pagedList;
      else state.itemsPagedList = null;      
   },
   [SET_NOTIFICATIONS_PARAMS](state, params) {
      state.params = params;
   },
   [SET_NOTIFICATIONS](state, pagedList) {
      if(pagedList) {
         state.pagedList = pagedList;
         let viewList = pagedList.viewList;
         if(viewList && viewList.length) {
            state.list = state.list.concat(viewList);
         }
      }else {
         state.pagedList = null;
         state.list = [];
      }
   },
   [SET_NOTIFICATION](state, model) {
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
 