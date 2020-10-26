<template>
	<v-footer color="red" app dark>
		<div style="font-size:14px">
			<span v-if="year">&copy; {{ year }}</span>
			<span class="ml-1" v-if="title">{{ title }}</span>
		</div>
		<div class="ml-3">
			<v-btn text @click="linkTo('/contact')">
				<span class="white--text" style="font-size:1rem">聯絡我們</span>
			</v-btn>
			<!-- <v-btn text @click="linkTo('/notices')" style="margin-left:1px; padding-left:1px">
				<span class="white--text" style="font-size:1rem">公告訊息</span>
			</v-btn> -->
		</div>
		
		
	</v-footer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { GO_TO_PAGE } from '@/store/actions.type';
import { SITE_TITLE } from '@/config';
export default {
	name: 'TheFooter',
	data() {
		return {
			year: 0,
			title: ''
		}
	},
	beforeMount() {
		let today = new Date();
		this.year = today.getFullYear();

		this.title = SITE_TITLE;
		},
	computed:{
		...mapGetters(['footerMenus'])
	},
	methods:{
      showMenu(key) {
         return this.footerMenus.findIndex(item => item.name === key) > -1;
		},
		linkTo(path) {
			Bus.$emit(GO_TO_PAGE, { path });
		}
	}
}
</script>
