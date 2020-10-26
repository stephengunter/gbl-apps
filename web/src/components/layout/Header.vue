<template>
   <v-app-bar app color="red" dark>
      <v-app-bar-nav-icon @click.prevent="toggleDrawer" />
      <v-toolbar-title style="padding-left:1px" class="site-title">{{ title }}</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <menu-actions v-if="appActions.length" 
      :actions = "appActions"
      />

      <!-- <menu-notifications v-if="currentUser"
      /> -->
      
      <div class="ml-1">
         
      </div>

      <menu-user v-if="currentUser" :user="currentUser"
      :menu_groups = "userMenus"
      />
      
      
   </v-app-bar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ACTION_SELECTED } from '@/store/actions.type';
import { TOGGLE_DRAWER } from '@/store/mutations.type';
import { SITE_TITLE, DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'TheHeader',
   data() {
      return {
         title: SITE_TITLE
      }
   },
   computed:{
		...mapGetters(['currentUser', 'appActions', 'userMenus'])
   },
   methods:{
      toggleDrawer(){
         this.$store.commit(TOGGLE_DRAWER);
      }
   }
};
</script>

<style scoped>
.site-title {
   font-size : 1.5rem!important;
}
</style>