<template>
   <v-alert color="info" text :class="classes" :style="styles">
      <ul>
         <li v-for="(item, index) in list" :key="index" v-text="item">
         </li>
      </ul>
   </v-alert>
</template>

<script>
export default {
   name: 'PS',
   props: {
      list: {
         type: Array,
         default: () => []
      },
      classes: {
         type: String,
         default: ''
      },
      styles: {
         type: String,
         default: ''
		}
	}
}
</script>

<style>

</style>