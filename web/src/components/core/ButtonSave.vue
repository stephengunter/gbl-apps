<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ on, attrs }">
         <v-btn  small fab :color="disabled ? 'default' : 'success'" :class="class_name"
         :disabled="disabled" @click.prevent="save"  v-bind="attrs" v-on="on"
         >
            <v-icon dark>mdi-content-save</v-icon>
         </v-btn>
      </template>
      <span v-text="tooltip"></span>
   </v-tooltip>
   <v-btn v-else small fab :color="disabled ? 'default' : 'success'" :class="class_name"
   :disabled="disabled" @click.prevent="create"
   >
      <v-icon dark>mdi-content-save</v-icon>
   </v-btn>
  
</template>

<script>
export default {
   name: 'ButtonSave',
   props: {
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
      save() {
         this.$emit('save')
      }
   }
}
</script>

<style>

</style>