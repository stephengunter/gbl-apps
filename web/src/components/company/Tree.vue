<template>
   <div>
      <v-treeview ref="treeCompanies" activatable
      :active.sync="active" :open.sync="open" 
      active-class="primary--text"
      :items="list" item-children="subItems"
      >
         <template v-slot:label="{ item, active }">
            <div :parent="item.parentId" :company-id="item.id">
               <v-menu offset-y v-if="active">
                  <template v-slot:activator="{ on,  attrs }">
                     <v-btn dark icon color="success" v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                     </v-btn>
                  </template>
                  <v-list>
                     <v-list-item v-for="action in actionList(item)" :key="action.name"
                     @click.prevent="onAction({ name: action.name, id: item.id })"
                     >
                        <v-list-item-icon>
                           <v-icon :color="action.icon.color" v-text="action.icon.text"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{ action.title }}</v-list-item-title>
                     </v-list-item>
                  </v-list>
               </v-menu>
               
               <v-btn text :class="{ 'primary--text' : active }">
                  <span class="text-h6">
                     {{ item.id }} {{ item.title }}
                  </span>
                  <span class="text-subtitle-2 ml-3">
                     {{ item.address.text }}
                  </span>
                  <span class="text-subtitle-2 ml-3" v-text="phone(item.phone)">
                  </span>
               </v-btn>
            </div>
         </template>
      </v-treeview>
   </div>   
</template>


<script>
import Sortable from 'sortablejs';
import { ICONS, CREATE, SELECT, EDIT, DELETE } from '@/consts';
import { isTrue, arrayEquals } from '@/utils';
export default {
	name: 'CompanyTree',
	props: {
      list: {
         type: Array,
         default: () => []
      },
      version: {
         type: Number,
         default: 0
      },
      actions: {
         type: Array,
         default: () => []
      }
	},
	data () {
		return {
         sortables: [],
         dirty: false,
         active: [],
         open: [],

         references: {}
		}
   },
   computed:{
      allowCreate() {
         return this.actions.includes(CREATE);
      },
      allowSelect() {
         return this.actions.includes(SELECT);
      },
      allowEdit() {
         return this.actions.includes(EDIT);
      },
      allowDelete() {
         return this.actions.includes(DELETE);
      },
      subItems() {
         return this.list.flatMap(x => x.subItems);
      }, 
      selectId() {
         if(this.active.length) return this.active[0];
			return null;
      },
      treeCompanies() {
			if(this.$refs.treeCompanies) return this.$refs.treeCompanies;
			else if (this.references.treeCompanies) return this.references.treeCompanies;
			return null;
      },
      originOrder() {
         return this.list.map(item => ({
            id: item.id, orders: item.subItems.map(x => x.id)
         }));
      }          
   },
   mounted() {
      this.references = { ...this.$refs };
   },
   watch: {
      open(newVal, oldVal) {
         if(!this.version) return;
         //只在新的節點打開時執行
         if(newVal.length > oldVal.length) {
            let id = newVal.find(x => !oldVal.includes(x));
            let sortableModel = this.sortables.find(x => x.id === id);
            if(sortableModel) return;
            
            this.onNewNodeOpen(id);
         }
      },
      'version' : 'init'
   },
	methods: {
      init() {
         this.sortables = [];
         this.dirty = false;
         this.open.forEach(id => this.onNewNodeOpen(id));
      },
      onNewNodeOpen(id) {
         let index = this.list.findIndex(item => item.id === id);
         this.$nextTick(() => {
            let el = this.treeCompanies.$el;
            let childrenNode = el.children[index].children[1];
            if(childrenNode) this.bindSortable(childrenNode, id);
         });
      },
      phone(val) {
         return val.replace('<br>', ' ');
      },
      bindSortable(node, id) {
         
         for (let i = 0; i < node.children.length; i++) {
            let labelTag = this.findLabelTag(node.children[i]);
            let companyId = labelTag.getAttribute('company-id');

            node.children[i].setAttribute('data-id', companyId);
         }

         let model = Sortable.create(
            node,
            {
               group: id, 
               draggable: '.v-treeview-node',
               onEnd: this.onDragEnd
            }
         );

         this.sortables.push({ id, model });
         
      },
      findLabelTag(node) {
         let rootNode = node.children[0];

         let tag = null;
         for (let i = 0; i < rootNode.children.length; i++) {
            if(rootNode.children[i].getAttribute('class') === 'v-treeview-node__content') {
               tag = rootNode.children[i].children[0].children[0];
               break;
            }
         }
         return tag;
      },
      onDragEnd (e) {
         this.$nextTick(() => {
            let orders = this.getOrders();
            this.checkDirty(orders);
         });     		
      },
      getOrders() {
         return this.sortables.map(item => ({
               id: item.id, orders: item.model.toArray().map(id => parseInt(id))
         }));
      },
      checkDirty(orders) {
         let dirty = false;
         for (let i = 0; i < orders.length; i++) {
            let id = orders[i].id;
            let origin = this.originOrder.find(x => x.id === id);

            if(!arrayEquals(origin.orders, orders[i].orders)) {
               dirty = true;
               break;
            }
         }

         this.dirty = dirty;
      },
      actionList(item) {
         let items = [];
         if(this.allowSelect) {
            items.push({
               name: SELECT, title: '選取', icon: { text: ICONS[SELECT], color: 'info' }
            });
         }
         if(item.isRoot) {
            if(!item.top) {
               items.push({
                  name: 'top', title: '置頂', icon: { text: ICONS['top'], color: 'yellow' }
               });
            }
         }
         
         if(this.allowEdit) {
            if(item.isRoot && item.title) {
               items.push({
                  name: 'sub', title: '新增子公司', icon: { text: 'mdi-file-tree', color: 'info' }
               });
            }
            items.push({
               name: EDIT, title: '編輯', icon: { text: ICONS[EDIT], color: 'success' }
            });
         }
         if(this.allowDelete) {
            items.push({
               name: DELETE, title: '刪除', icon: { text: ICONS[DELETE], color: 'error' }
            });
         }
         return items;
      },
      onAction({ name, id }) {
         this.$emit(name, id);
      }
	}
}
</script>
