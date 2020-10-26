<template>
	<v-container>
		Ads
	</v-container>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'AdsView',	
	data() {
		return {
			items: []
		}
	},
	computed:{
		...mapGetters(['currentPage', 'breadItems', 'responsive']),
	},
	beforeMount() {
		
	},
	methods: {
		onBreadSelected() {

		},
		select(id) {
			console.log('select', id);
		}
	}
}
</script>
