<template>
   <v-container>
		<core-bread />     
      
      <company-manage :title="manage.title" :actions="manage.actions" />	
	</v-container>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_BREAD } from '@/store/actions.type';
import { SELECT, CREATE, EDIT, DELETE } from '@/consts';

export default {
   name: 'UserCompaniesView',
   data() {
		return {
         manage: {
            title: '',
            actions: [SELECT, EDIT, DELETE]
         },
		}
	},
	computed:{
      ...mapGetters(['router']),
   },
   beforeMount() {
      this.$store.dispatch(LOAD_BREAD);
   },
   methods: {
      
	}
}
</script>

<style>

</style>