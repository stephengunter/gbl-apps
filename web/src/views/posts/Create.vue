<template>
	<v-container>
		<core-bread @selected="onBreadSelected" />
		<v-row>
			<v-col cols="12">
			<post-edit v-if="model" :category="rootCategory"
			:model="model"
			@cancel="cancel"
			/>
			</v-col>
		</v-row>
	</v-container>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_BREAD, CREATE_POST, ON_ERROR, GO_TO_PAGE } from '@/store/actions.type';
import { SET_USER_COMPANIES } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { CREATE_TEXT } from '@/consts';

export default {
	name: 'PostCreateView',	
	data() {
		return {
			model: null
		}
	},
	computed:{
		...mapGetters(['rootCategory']),
		...mapState({
			companies: state => state.user.companies,
      }),
	},
	beforeMount() {
		this.$store.dispatch(LOAD_BREAD);		

		this.$store.dispatch(CREATE_POST)
		.then(model => {
			this.$store.commit(SET_USER_COMPANIES, model.companies);
			this.model = model.post;
		})
		.catch(error => {
			this.onError(error);
		})	
	},
	methods: {
		onBreadSelected(item) {
			Bus.$emit(GO_TO_PAGE, { path: item.action });
      },
		onError(error) {
         this.$store.dispatch(ON_ERROR, error)
      },
		cancel() {
			this.backToIndex();
		},
		backToIndex() {
			Bus.$emit(GO_TO_PAGE, { path: this.rootCategory.path });
		}
	}
}
</script>
