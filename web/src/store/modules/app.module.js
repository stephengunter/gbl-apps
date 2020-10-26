import Errors from '@/common/errors';
import { PRODUCTION } from '@/config';
import { INIT, FETCH_ACTIONS, LOAD_ACTIONS, 
SCROLL_TOP, ON_ERROR
} from '@/store/actions.type';

import { 
   SET_BREAD_ITEMS, SET_LOADING, SET_ERRORS, CLEAR_ERRORS, 
   SET_DRAWER, SET_WINDOW_WIDTH,
   SET_RESPONSIVE, TOGGLE_DRAWER, SET_VIEW_ACTIONS, SET_APP_ACTIONS
} from '@/store/mutations.type';

import { isEmptyObject, fetchViewActions } from '@/utils';

const initialState = {
   breadItems: [],
   loading: false,
   loadingText: '',
   sideBarWidth: 260,
   windowWidth: 991,
   responsive: false,
   drawer: null,
   viewActions: [],
   actions: [],
   errorList: new Errors(),
};

export const state = { ...initialState };


const getters = {
   breadItems(state) {
      return state.breadItems;
   },
   loading(state) {
      return state.loading;
   },
   windowWidth(state) {
      return state.windowWidth;
   },
   contentMaxWidth(state) {
      if(state.responsive) return state.windowWidth * 0.9;
      return (state.windowWidth - state.sideBarWidth) * 0.9;
   },
   responsive(state) {
      return state.responsive;
   },
   appActions(state) {
      return state.actions;
   },
   errorList(state) {
      return state.errorList;
   }
};

const actions = {
   [INIT](context) {
      context.commit(SET_LOADING, false);
      context.commit(CLEAR_ERRORS);
      context.commit(SET_BREAD_ITEMS, []);
   },
   [FETCH_ACTIONS](context, route) {
      context.commit(SET_APP_ACTIONS, []);
      let viewActions = fetchViewActions(route.name);
      context.commit(SET_VIEW_ACTIONS, viewActions);
   },
   [LOAD_ACTIONS](context, blocks) {
      let viewActions =  context.state.viewActions;

      let actions = [];
      blocks.forEach(block => {
         let blockActions = [];
         block.forEach(name => {
            blockActions.push(viewActions.find(item => item.name === name));
         })
         actions.push(blockActions);
      });

      context.commit(SET_APP_ACTIONS, actions);
   },
   [ON_ERROR](context, error) {
      if(error) {
         if(!PRODUCTION) console.error('error', error);
         if(error.status && error.status === 400) {
            if(!isEmptyObject(error)) {
               context.commit(SET_ERRORS, error.data);
               return;
            }
         } 
      }
      Bus.$emit('errors', error);
   },
   [SCROLL_TOP](context) {
      var element = document.getElementById('app-container');
      if(!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
   },
}



const mutations = {
   [SET_BREAD_ITEMS](state, items) {
      state.breadItems = items;
   },
   [SET_LOADING](state, loading, text = '') {
      state.loading = loading;
      if(loading) state.loadingText = text;
      else state.loadingText = '';
   },
   [SET_WINDOW_WIDTH](state, val) {
      state.windowWidth = val;
   },
   [SET_RESPONSIVE](state, val) {
      state.responsive = val;
   },
   [SET_DRAWER](state, drawer) {
      state.drawer = drawer;
   },
   [TOGGLE_DRAWER](state) {
      state.drawer = !state.drawer;
   },
   [SET_VIEW_ACTIONS](state, actions) {
      state.viewActions = actions;
   },
   [SET_APP_ACTIONS](state, actions) {
      state.actions = actions;
   },
   [SET_ERRORS](state, errors) {
      if(isEmptyObject(errors)) return;
      state.errorList.record(errors);
   },
   [CLEAR_ERRORS](state) {
      state.errorList.clear();   
   },
};

export default {
   state,
   actions,
   mutations,
   getters
};
 