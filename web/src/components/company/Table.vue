<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer 
   item-key="id" :server-items-length="list.length"
   >
      <template v-slot:top>
         <slot name="top">
            
         </slot>
      </template>
      <template v-slot:item.actions="{ item }">
         <v-menu offset-y>
            <template v-slot:activator="{ on,  attrs }">
               <v-btn dark icon color="info" v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
               </v-btn>
            </template>
            <v-list>
               <v-list-item v-for="action in actionList(item)" :key="action.name"
               @click.prevent="onAction({ name: action.name, id: item.id })"
               >
                  <v-list-item-icon>
                     <v-icon :color="action.icon.color" v-text="action.icon.text"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ action.title }}</v-list-item-title>
               </v-list-item>
            </v-list>
         </v-menu>
      </template>
      <template v-slot:item.address="{ item }">
         {{ item.address.text }}
      </template>
      <template v-slot:item.phone="{ item }">
         <span v-html="item.phone"></span>
      </template>
   </v-data-table>
</template>


<script>
import { ICONS, CREATE, SELECT, EDIT, DELETE } from '@/consts';

export default {
	name: 'CompanyTable',
	props: {
      list: {
         type: Array,
         default: () => []
      },
      actions: {
         type: Array,
         default: () => []
      }
	},
	data () {
		return {
		}
   },
   computed:{
      allowCreate() {
         return this.actions.includes(CREATE);
      },
      allowSelect() {
         return this.actions.includes(SELECT);
      },
      allowEdit() {
         return this.actions.includes(EDIT);
      },
      allowDelete() {
         return this.actions.includes(DELETE);
      },
      headers() {
         let headers = [{
            sortable: false,
            text: '名稱',
            value: 'title'
         },
         {
            sortable: false,
            text: '地址',
            value: 'address'
         },
         {  
            sortable: false,
            text: '電話',
            value: 'phone'
         }];

         if(this.actions.length) {
            headers.unshift({
               sortable: false,
               text: '',
               value: 'actions'
            });
         }
         
         return headers;
      }
   },
	methods: {
      canSelect(id) {
         if(this.selected.length) {
            return this.selected.includes(id);
         }else return true;
      },
      actionList(item) {
         let items = [];
         if(this.allowSelect) {
            items.push({
               name: SELECT, title: '選取', icon: { text: ICONS[SELECT], color: 'info' }
            });
         }
         if(!item.top) {
            items.push({
               name: 'top', title: '置頂', icon: { text: ICONS['top'], color: 'yellow' }
            });
         }
         if(this.allowEdit) {
            items.push({
               name: EDIT, title: '編輯', icon: { text: ICONS[EDIT], color: 'success' }
            });
         }
         if(this.allowDelete) {
            items.push({
               name: DELETE, title: '刪除', icon: { text: ICONS[DELETE], color: 'error' }
            });
         }
         return items;
      },
      onAction({ name, id }) {
         this.$emit(name, id);
      }
	}
}
</script>
