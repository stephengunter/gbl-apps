<template>
   <v-scroll-x-transition>
      <v-menu v-if="total > 0" offset-y v-model="open">
         <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
               <v-badge :content="total" :value="total"
               color="info" overlap
               >
                  <v-icon>mdi-bell</v-icon>
               </v-badge>
            </v-btn>
         </template>
         <v-card class="mx-auto" :max-width="maxWidth" tile >
            <v-list>
               <v-list-item v-for="(item, index) in items" :key="index" @click.prevent="select(item)">
                  <v-list-item-content>
                     <v-list-item-title v-text="item.notice.title"></v-list-item-title>
                     <v-list-item-subtitle class="mt-1" v-text="plainText(item.notice.content)"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                  <v-list-item-action-text>
                     <core-time-ago :val="item.notice.lastUpdated" />
                  </v-list-item-action-text>
               </v-list-item-action>
               </v-list-item>
            </v-list>
            <v-card-actions v-if="hasMore">
               <v-spacer />		
               <v-btn @click.prevent="more" text color="primary">
                  ..更多訊息
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-menu>
   </v-scroll-x-transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { NOTIFICATIONS, FETCH_NOTIFICATION_ITEMS, CLEAR_NOTIFICATIONS,
GO_TO_PAGE } from '@/store/actions.type';
import { SET_AUTH_CHANGED } from '@/store/mutations.type';
import { API_URL, DIALOG_MAX_WIDTH } from '@/config';
import { removeTags } from '@/utils';
import Hub from '@/models/hub';

export default {
   name: 'NotificationsMenu',
   beforeMount() {
      this.init();
   },
   beforeDestroy() {
      if(this.hubModel) this.hubModel.disconnect();
   },
   data() {
      return {
         hubModel: null,

         maxWidth: DIALOG_MAX_WIDTH,
         maxCount: 8,
         open: false
      }
   },
   watch: {
      currentPage: 'onCurrentPageChanged',
      open: 'onOpenChanged'
   },
   computed: {
		...mapState({
			pagedList: state => state.notifications.itemsPagedList
      }),
      ...mapGetters(['currentPage', 'currentUser']),
      items() {
         if(this.pagedList) {
            return this.pagedList.viewList.slice(0, this.maxCount);
         }
			return [];
      },
      total() {
         if(this.pagedList) {
            return this.pagedList.totalItems;
         }
			return 0;
      },
		hasMore() {
			if(this.pagedList) return this.total > this.items.length;
			return false;
		}
   },
   methods:{
      init() {
			if(this.hubModel){
            this.hubModel.disconnect();
         }else{
            this.hubModel = new Hub(this.currentUser);
            this.hubModel.on(NOTIFICATIONS, () => {
					this.fetchData();
				});
         }
      },
      plainText(str) {
			return removeTags(str).trim();
		},
      onCurrentPageChanged(newVal, oldVal) {
         if(oldVal) return;
         if(newVal && newVal.name !== 'notifications') {
            this.fetchData();
         }
      },
      onOpenChanged(val) {
         if(val) return;

         this.clear(); // 菜單關閉, 清除未讀訊息
      },
      fetchData() {
			this.$store.dispatch(FETCH_NOTIFICATION_ITEMS, { page: 0 })
			.catch(error => {
            let status = error.status;
            if(status === 401) {
               this.$store.commit(SET_AUTH_CHANGED, true);
            }
			})
      },
      select(item) {
         
         this.$router.push({ name: 'notification-details', params: { id: item.id }})
      },
      more() {
         Bus.$emit(GO_TO_PAGE, { name: 'notifications' });
      },
      clear() {
         let ids = this.items.map(item => item.id);
         if(ids.length) {
            this.$store.dispatch(CLEAR_NOTIFICATIONS, ids);
         }
		}
   }
}
</script>

<style>

</style>