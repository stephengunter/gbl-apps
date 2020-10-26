<template>
	<v-container>
		<core-bread @selected="onBreadSelected" />
		<v-row>
			<v-col cols="8">
			</v-col>
			<v-col cols="4" class="text-right">
				<core-button-create-post @create="onCreate" />
			</v-col> 
		</v-row>	
		<div>
			<v-row>
				<v-col v-for="(model, index) in items" :key="index" cols="12" md="4" sm="6">
					<a href="#" @click.prevent="select(model.id)">
					<job-item :model="model" />
					</a>
				</v-col>
			</v-row>
		</div>
		<v-dialog scrollable persistent
		v-model="bootstrap.active" :max-width="bootstrap.maxWidth"
		>
			<job-bootstrap :title="bootstrap.title" :model="bootstrap.model"
			@cancel="cancelCreate"
			/>
			
      </v-dialog>
	</v-container>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_BREAD, CREATE_POST, ON_ERROR } from '@/store/actions.type';
import { SET_USER_COMPANIES } from '@/store/mutations.type';
import { CREATE_TEXT } from '@/consts';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'JobsView',	
	data() {
		return {
			items: [],
			model: null,
			bootstrap: {
				title: '',
				model: null,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			}
		}
	},
	computed:{
		...mapGetters(['currentPage', 'rootCategory','contentMaxWidth']),
	},
	beforeMount() {
		this.$store.dispatch(LOAD_BREAD);

		this.bootstrap.title = `${CREATE_TEXT}：${this.rootCategory.title}`;

		for(let i = 0; i < 14; i++) {
			this.items.push({
				id: i + 1, title: '急徵 漁獲搬運工 薪3萬起(請直接電洽，可立即上班)',
				date: '2020-09-21',
				company: { title: '海瑞商行', location: '嘉義縣東石鄉'}
			});
		}
	},
	methods: {
		onBreadSelected() {

		},
		onCreate() {
			this.$store.dispatch(CREATE_POST)
			.then(model => {
				this.$store.commit(SET_USER_COMPANIES, model.companies);
				this.setBootstrapModel(model.post);
			})
			.catch(error => {
				this.onError(error);
			})
		},
		create() {
			

			// this.bootstrap.title = `${CREATE_TEXT}：${this.rootCategory.title}`;
			// this.bootstrap.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			// this.bootstrap.active = true;
			//this.$router.push({ path: `${this.currentPage.path}/create` });
		},
		cancelCreate() {
			this.setBootstrapModel(null);
		},
		setBootstrapModel(model) {
			if(model) {
				this.bootstrap.model = model;
				this.bootstrap.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.bootstrap.active = true;
			}else {
				this.bootstrap.model = null;
				this.bootstrap.active = false;
			}
		},
		select(id) {
			console.log('select', id);
		}
	}
}
</script>
