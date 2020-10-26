<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ on }">
         <v-btn small icon :color="color" v-on="on"
         @click.prevent="onClick"
         >
            <v-icon dark v-text="icon"></v-icon>
         </v-btn>
      </template>
      <span v-text="text"></span>
   </v-tooltip>
   <v-btn v-else small icon :color="color" :class="class_name"
   :disabled="disabled" @click.prevent="onClick"
   >
      <v-icon dark v-text="icon"></v-icon>
   </v-btn>
  
</template>

<script>
import { ICONS, EDIT, DELETE, CANCEL } from '@/consts';

export default {
   name: 'IconButton',
   props: {
      mode: {
         type: String,
         default: ''
      },
      title: {
         type: String,
         default: ''
      },
      tooltip: {
         type: Boolean,
         default: true
      },
      disabled: {
         type: Boolean,
         default: false
      },
      class_name: {
         type: String,
         default: ''
      },
   },
   computed:{
		text() {
         if(this.title) return this.title;

         if(this.mode === EDIT) return '編輯';
         else if(this.mode === DELETE) return '刪除';
         else if(this.mode === CANCEL) return '取消';
         return '';
      },
      icon() {
         return ICONS[this.mode];
      },
      color() {
         if(this.mode === EDIT) return 'success';
         else if(this.mode === DELETE) return 'error';
         return '';
      },
	},
   methods: {
      onClick() {
         this.$emit('click')
      }
   }
}
</script>

<style>

</style>