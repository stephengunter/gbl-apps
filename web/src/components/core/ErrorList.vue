<template>
   <v-alert :value="hasErrors" color="error" outlined>
      <ul v-if="hasErrors">
         <li v-for="(v, k) in errorList.errors" :key="k" v-text="v[0]">
         </li>
      </ul>
   </v-alert>
   
</template>

<script>

import { mapState } from 'vuex';

export default {
   name: 'ErrorList',
   computed: {
      ...mapState({
         errorList: state => state.app.errorList
      }),
      hasErrors(){
         if(!this.errorList) return false; 
         return this.errorList.any();
      }
   },
};
</script>
