<template>
   <v-navigation-drawer v-model="drawer" id="app-drawer" app>
      <div class="text-center mt-2">
         <v-avatar>
            <img :src="require('@/assets/logo.png')">
         </v-avatar>
      </div>
      <v-list>
         <menu-drawer v-for="(item, index) in menus" :key="index" 
         :item="item"
         />
      </v-list>
      <!-- <v-list dense>
         <v-list-item link v-for="(item, index) in menus" :key="index" :to="item.path">
            <v-list-item-action>
               <v-icon>{{ item.meta.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
               <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
            </v-list-item-content>
         </v-list-item>
      </v-list> -->
   </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Menu from '@/common/menu';
import { SET_DRAWER, TOGGLE_DRAWER } from '@/store/mutations.type';

export default {
   name: 'TheDrawer',
   data(){
		return {
			
		}
   },
   computed: {
		...mapGetters(['responsive', 'menus']),
    	drawer: {
         get() {
            return this.$store.state.app.drawer
         },
         set(val) {
            this.setDrawer(val)
         }
		}
   },
   beforeMount() {
     
      
   },
   methods:{
      setDrawer(val) {
         this.$store.commit(SET_DRAWER, val);
      }
	}
}
</script>

<style>

</style>