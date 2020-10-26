<template>
   <v-list-group v-if="item.subItems && item.subItems.length" no-action
   :prepend-icon="item.meta.icon" 
   :value="isActive(item)"
   >
      <template v-slot:activator>
         <v-list-item-content @click.prevent="linkTo(item)">
            <v-list-item-title style="font-size: 14px;" v-text="item.meta.title" />
         </v-list-item-content>
      </template>
      <v-list-item v-for="(subItem, subIndex) in item.subItems" :key="subIndex" link
      :to="link(item, subItem)"
      >
         <v-list-item-title style="font-size: 14px;" v-text="subItem.title" />
         <v-list-item-icon v-if="subItem.icon">
            <v-icon v-text="subItem.icon"></v-icon>
         </v-list-item-icon>
      </v-list-item>
   </v-list-group>
   <v-list-item v-else :to="item.path" >
      <v-list-item-icon>
         <v-icon>{{ item.meta.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title style="font-size: 14px;" v-text="item.meta.title" />
   </v-list-item>
</template>


<script>
import { GO_TO_PAGE } from '@/store/actions.type';
import { CATEGORY } from '@/consts';
import { buildQuery } from '@/utils';

export default {
   name: 'MenuDrawer',
   props: {
      item: {
         type: Object,
         default: null
      },
      color: {
         type: String,
         default: 'info'
      },
   },
   methods: {
      isActive(item) {
         if(item.active) return true;

         let subActive = item.subItems.find(subItem => subItem.active);
         if(subActive) return true;
         return false;
      },
      link(item, subItem) {
         let query = {
            [CATEGORY] : subItem.id
         };
         return buildQuery(item.path, query);
      },
      linkTo(item) {
         Bus.$emit(GO_TO_PAGE, { path: item.path });
      },
   }
}
</script>