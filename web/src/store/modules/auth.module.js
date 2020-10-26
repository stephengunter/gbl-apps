import jwtDecode from 'jwt-decode';
import BaseService from '@/common/baseService';

import AuthService from '@/services/auth.service';
import OAuthService from '@/services/oAuth.service';
import JwtService from '@/services/jwt.service';

import { GOOGLE_AUTH_PARAMS } from '@/config';
import GoogleAuth from '@/common/googleAuth';


import {
   CHECK_AUTH,
   REFRESH_TOKEN,
   LOGIN,
   INIT_GOOGLE_SIGNIN,
   GOOGLE_SIGNIN,
   LOGOUT
} from '../actions.type';

import { SET_AUTH, SET_AUTH_CHANGED, PURGE_AUTH, SET_USER, 
   SET_CHECKING_AUTH, SET_LOADING 
} from '../mutations.type';

 
const state = {
   checkingAuth: false,
   user: null,
   changed: false
   
};

const getters = {
   currentUser(state) {
     return state.user;
   },
   checkingAuth(state) {
      return state.checkingAuth;
   },
   authChanged(state) {
      return state.changed;
   }
};

const resolveUser = (token) => {
   let claims = jwtDecode(token);
   return {
      id: claims.id,
      email: claims.sub,
      picture: claims.picture,
      name: claims.name,
      roles: claims.roles ? claims.roles.split(',') : []
   };
}

const actions = {
   [INIT_GOOGLE_SIGNIN](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         GoogleAuth.load(GOOGLE_AUTH_PARAMS).then(auth2 => {
            resolve({
               signedIn: auth2.isSignedIn.get()
            });		
         })
         .catch(err => {
            reject(err);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });     
   },
   [GOOGLE_SIGNIN](context) {
      return new Promise((resolve, reject) => {
         GoogleAuth.signIn()
         .then(googleUser => {
            resolve(googleUser.getAuthResponse().id_token);
         })
         .catch(err => {
            reject(err);
         })
      });
       
   },
   [LOGIN](context, token) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         OAuthService.googleLogin(token)
         .then(model => {
            context.commit(SET_AUTH, {
               token: model.accessToken.token,
               refreshToken: model.refreshToken
            }); 
            resolve(null);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });     
   },
   [LOGOUT](context) {
      context.commit(PURGE_AUTH);
      return new Promise(resolve => {
         setTimeout(() => {
            resolve(true);
         }, 500)
      }); 
   },
   [CHECK_AUTH](context) {
      return new Promise((resolve) => {
         let token = JwtService.getToken();
         if(token) {
            BaseService.setHeader(token);
            let user = resolveUser(token);
            context.commit(SET_USER, user); 
            resolve(user);           
         }else {
            context.commit(PURGE_AUTH);
            resolve(null);
         }
      });
   },
   [REFRESH_TOKEN](context) {
      return new Promise((resolve) => {
         let accessToken = JwtService.getToken();
         let refreshToken = JwtService.getRefreshToken();
         if(accessToken && refreshToken) {
            context.commit(SET_LOADING, true);
            AuthService.refreshToken({ accessToken, refreshToken })
            .then(model => {
               context.commit(SET_AUTH, {
                  token: model.accessToken.token,
                  refreshToken: model.refreshToken
               });
               resolve(true);
            })
            .catch(err => {
               context.commit(PURGE_AUTH);
               resolve(false);           
            })
            .finally(() => {
               context.commit(SET_LOADING, false);
            });
         }else {
            context.commit(PURGE_AUTH);
            resolve(false);
         }
      });
   }
};


const mutations = {
   [SET_USER](state, user) {
      if(user) state.user = user;
      else state.user = null;
   },
   [SET_AUTH](state, model) {
      JwtService.saveToken(model.token, model.refreshToken);
      state.user = resolveUser(model.token);
   },
   [SET_CHECKING_AUTH](state, val) {
      state.checkingAuth = val;
   },
   [SET_AUTH_CHANGED](state, val) {
      console.log(SET_AUTH_CHANGED, val);
      state.changed = val;
   },
   [PURGE_AUTH](state) {
      state.user = null;
      
      JwtService.destroyToken();
      BaseService.setHeader(null);
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 