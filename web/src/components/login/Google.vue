<template>
   <v-btn v-show="ready" outlined @click="signIn">
      <helper-google-logo />
      <span class="ml-3"> 使用 Google 登入 </span> 
   </v-btn>
</template>



<script>
import { INIT_GOOGLE_SIGNIN, GOOGLE_SIGNIN } from '@/store/actions.type';
import { onError } from '@/utils';
export default {
   name: 'GoogleLoginButton',
   data() {
      return {
         ready: false,
         googleSignedIn: false
      }
   },
   mounted() {
      this.init();
   },
   methods: {
      init() {
         this.$store.dispatch(INIT_GOOGLE_SIGNIN)
         .then(result => {
            this.googleSignedIn = result.signedIn;
            this.ready = true;    
         }).catch(error => {
            onError(error);
         })
      },
      signIn(){
         this.$store.dispatch(GOOGLE_SIGNIN)
         .then(id_token => {
            this.$emit('success', id_token);  
         }).catch(error => {
            this.$emit('failed');
         })
      }
   }
};
</script>