<template>
   <v-btn @click.prevent="close" :color="color" class="close-icon-btn" icon>
      <v-icon>mdi-close-circle-outline</v-icon>
   </v-btn>
</template>

<script>
export default {
   props: {
      color: {
         type: String,
         default: ''
      }
   },
   methods: {
      close() {
         this.$emit('close');
      }
   }
}
</script>

<style scoped>
  .close-icon-btn {
     margin : 0; 
     position : absolute;
     top : 0;
     right:0;
  }
</style>