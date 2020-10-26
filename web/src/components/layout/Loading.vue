<template>
   <v-overlay :value="loading">
      <div class="text-center">
         <v-progress-circular indeterminate size="48">
         </v-progress-circular>
         <p v-if="loadingText" style="margin:12px">
            {{ loadingText }}
         </p>
      </div>
   </v-overlay>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'LayoutLoading',
   computed:{
      ...mapState({
			loading: state => state.app.loading,
			loadingText: state => state.app.loadingText
		})
	},
}
</script>

<style>

</style>