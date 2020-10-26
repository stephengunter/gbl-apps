<template>
	<v-container>
		<div ref="treeCompanies">
			<div class="row-company">
				新增公告1
			</div>
			<div class="row-company">
				新增公告2
			</div>
			<div class="row-company">
				新增公告3
			</div>
			
		</div>
		<v-card>
			<v-card-title>
				<h3>新增公告</h3>
			</v-card-title>
			<v-card-text>
				<v-icon color="info" >mdi-file-tree</v-icon>
				<v-row>
					<v-col cols="12">
						<v-card>
							<v-card-title>
								公司資訊
							</v-card-title>
							
						</v-card>
					</v-col>
				</v-row>
				
			</v-card-text>
		</v-card>	
	</v-container>	
</template>

<script>
import Sortable from 'sortablejs';
import { distinctValues } from '@/utils';
import { mapState, mapGetters } from 'vuex';
import { ICONS, EDIT } from '@/consts';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'HomeView',
	data() {
		return {
			references: {}
		}
	},
	computed:{
		...mapGetters(['cities','contentMaxWidth', 'currentUser']),
		treeCompanies() {
			if(this.$refs.treeCompanies) return this.$refs.treeCompanies;
			else if (this.references.treeCompanies) return this.references.treeCompanies;
			return null;
		}		
	},
	watch: {
      selectId(newVal, oldVal) {
         console.log('newVal', newVal);
      }
   },
	mounted() {
		let a = [1];
		let b = [12, 1, 2];
		console.log(b.filter(x => !a.includes(x))[0]);

		this.references = { ...this.$refs };
      this.bindSortable();
	},
	methods: {
		bindSortable() {
			const el = this.treeCompanies;
         this.sortable = Sortable.create(
            el,
            {
               draggable: '.row-company',
               onEnd: this.onDragEnd
            }
         );
      },
      onDragEnd ({ oldIndex, newIndex }) {
         console.log('onDragEnd');   		
      },
	}
}
</script>
