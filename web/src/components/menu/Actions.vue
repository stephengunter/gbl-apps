<template>
  <v-menu offset-y>
      <template v-slot:activator="{ on }">
         <v-btn  icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
         </v-btn>
      </template>
      <v-card class="mx-auto" max-width="300" tile >
         <v-list v-for="(block, index) in actions" :key="index">
            <v-list-item v-for="(item, index) in block" :key="index" @click.prevent="onActionSelected(item.name)">
               <v-list-item-icon v-if="item.icon">
                  <v-icon>{{ item.icon }}</v-icon>
               </v-list-item-icon>
               <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
               </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < actions.length - 1"></v-divider>
         </v-list>
      </v-card>
   </v-menu>
</template>

<script>
import { ACTION_SELECTED } from '@/store/actions.type';

export default {
   name: 'ActionsMenu',
   props: {
      actions: {
         type: Array,
         default: null
      }
   },
   data() {
      return {
         pictureError: false,
         messages: 10
      }
   },
   methods:{
      onActionSelected(name) {
         Bus.$emit(ACTION_SELECTED, name);
      }
   }
}
</script>

<style>

</style>