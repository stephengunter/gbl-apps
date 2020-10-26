<template>
<div>
   <div v-show="indexMode">
      <v-row v-show="dataFetched">
         <v-col cols="12">
            <v-toolbar flat>
               <v-toolbar-title style="width:70%">
                  <core-ps :list="ps" classes="mb-0" />
               </v-toolbar-title>

               <v-spacer />
               
               <core-button-save v-if="dirty" tooltip="存檔" class_name="mr-3"
               @save="saveOrders"
               />
               <core-button-create tooltip="新增" :disabled="!canCreate"
               @create="create"
               />
            </v-toolbar>

            <company-tree ref="companies"
            :list="companies" :actions="actions" :version="version"
            @select="onSelected" @top="top" @sub="addSubCompany"
            @edit="edit" @delete="remove"
            />
            
         </v-col>
         <v-col cols="12">
            <core-error-list />
         </v-col>
      </v-row>
   </div>
   <div v-show="!indexMode">
      <v-row>
         <v-col cols="12">
            <company-edit v-if="editor.model"
            :title="title" :model="editor.model"
            @cancel="cancelEdit" @save="onSave"
            />
         </v-col>
      </v-row>
   </div>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_BREAD_ITEMS, SET_LOADING, CLEAR_ERRORS } from '@/store/mutations.type';
import { FETCH_USER_COMPANIES, CREATE_USER_COMPANY, STORE_USER_COMPANY,
EDIT_USER_COMPANY, UPDATE_USER_COMPANY, DELETE_USER_COMPANY, TOP_USER_COMPANY,
ON_ERROR, SHOW_CONFIRM, SUCCESS 
} from '@/store/actions.type';
import { DIALOG_MAX_WIDTH, USER_COMPANIES } from '@/config';
import { INDEX, CREATE, EDIT, DELETE } from '@/consts';
import { onError } from '@/utils';

export default {
   name: 'UserCompaniesManage',
   props: {
      title: {
         type: String,
         default: ''
      },
      actions: {
         type: Array,
         default: () => []
      }
	},
   data() {
		return {
         mode: INDEX,
         max: 0,
         dataFetched: false,
         version: 0,
         editor: {
				model: null
         },
         deletion: {
				id: 0
         },
         
         references: {}
		}
	},
	computed:{
      ...mapState({
			companies: state => state.user_companies.list
      }),
      indexMode() {
			return this.mode === INDEX;
		},
      canCreate() {
         return this.companies.length < this.max;
      },
      ps() {
         if(this.max) {
            return [`最多儲存${this.max}筆`];
         }else return [];
      },
      treeCompanies() {
			if(this.$refs.companies) return this.$refs.companies;
			else if (this.references.companies) return this.references.companies;
			return null;
      },
      dirty() {
         if(this.treeCompanies) return this.treeCompanies.dirty;
         return false;
      }
   },
   beforeMount() {
      this.init();

      if(USER_COMPANIES) {
         this.max = USER_COMPANIES.max;
      };

      this.fetchData();
   },
   mounted() {
      this.references = { ...this.$refs };
   },
   methods: {
      init() {
         this.mode = INDEX;
         this.editor = {
				model: null
         };
         this.deletion = {
				id: 0
			};
      },
      fetchData() {
         this.$store.dispatch(FETCH_USER_COMPANIES)
         .then(() => {
            this.version += 1;
            this.dataFetched = true;
         })
         .catch(error => {
            this.onError(error);
         })

         
      },
      onError(error) {
         this.$store.dispatch(ON_ERROR, error)
      },
      onSelected(id) {
         let item = this.companies.find(item => item.id === id);
			this.$emit('selected', item);
      },
      top(id) {
         this.$store.commit(CLEAR_ERRORS);
         this.$store.dispatch(TOP_USER_COMPANY, id)
			.then(() => {
				Bus.$emit(SUCCESS);
				this.init();
				this.fetchData();
			})
			.catch(error => {
				this.onError(error);
			})
      },
      addSubCompany(id) {
         this.$store.commit(CLEAR_ERRORS);
			this.$store.dispatch(CREATE_USER_COMPANY)
			.then(model => {
            model.parentId = id;
				this.setEditModel(model);
			})
			.catch(error => {
				this.onError(error);
         })
      },
		create() {
         this.$store.commit(CLEAR_ERRORS);
			this.$store.dispatch(CREATE_USER_COMPANY)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				this.onError(error);
         })
      },
      edit(id) {
         this.$store.commit(CLEAR_ERRORS);
			this.$store.dispatch(EDIT_USER_COMPANY, id)
			.then(model => {
            this.setEditModel(model);
			})
			.catch(error => {
				this.onError(error);
         })
      },
      remove(id) {
         this.$store.commit(CLEAR_ERRORS);

         this.deletion.id = id;
			Bus.$emit(SHOW_CONFIRM, {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {
               this.deletion.id = 0;
            }
			});
      },
      cancelEdit() {
         this.setEditModel(null);
      },
      setEditModel(model) {
         if(model) {
            this.editor.model = model;
            this.mode = model.id ? EDIT : CREATE;
         }else {
            this.mode = INDEX;
            this.editor.model = null;
         }
      },
      onSave() {
         let model = this.editor.model;
         let action = model.id ? UPDATE_USER_COMPANY : STORE_USER_COMPANY;
			this.$store.dispatch(action, model)
			.then(() => {
				Bus.$emit(SUCCESS);
				this.init();
				this.fetchData();
			})
			.catch(error => {
				this.onError(error);
			})
      },
      submitDelete() {
         let id = this.deletion.id
			this.$store.dispatch(DELETE_USER_COMPANY, id)
			.then(() => {
				this.init();
				this.fetchData();
			})
			.catch(error => {
				this.onError(error);
			})
      },
      saveOrders() {
         let orders = this.treeCompanies.getOrders();
         console.log('orders', orders);
      }
      
	}
}
</script>

<style>

</style>