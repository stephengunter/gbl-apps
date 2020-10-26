<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ on, attrs }">
         <v-btn :color="color" @click.prevent="create" v-bind="attrs" v-on="on"
         :disabled="disabled"
         >
            {{ text }}
         </v-btn>
      </template>
      <span v-text="tooltip"></span>
   </v-tooltip>
   <v-btn v-else :color="color" @click.prevent="create"
   :disabled="disabled"
   >
      {{ text }}
   </v-btn>
  
</template>

<script>
import { CREATE_TEXT } from '@/consts';
export default {
   name: 'ButtonCreate',
   props: {
      color: {
         type: String,
         default: 'primary'
      },
      text: {
         type: String,
         default: CREATE_TEXT
      },
      tooltip: {
         type: String,
         default: ''
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
   methods: {
      create() {
         this.$emit('create')
      }
   }
}
</script>

<style>

</style>