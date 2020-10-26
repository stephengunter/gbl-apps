<template>
   <v-app id="app-container">
		<layout-drawer />
		<layout-header />
		<layout-container />
		
		<layout-loading />

		<v-snackbar :timeout="success.timeout" top right dark
			:color="success.color" v-model="success.show"
		>
			<v-icon color="white" class="mr-3">
			{{ success.icon }}
			</v-icon>
			<span class="successText cn">
				{{ success.msg  }}
			</span>
		</v-snackbar>

		<v-dialog v-model="confirm.active" :max-width="confirm.maxWidth" :persistent="!confirmNoAction">
			<core-confirmation :type="confirm.type"
			:title="confirm.title" :text="confirm.text"
			:ok_text="confirm.ok_text"  :cancel_text="confirm.cancel_text"
			:on_cancel="confirm.on_cancel"  :on_ok="confirm.on_ok"
			@ok="hideConfirm" @cancel="hideConfirm"
			/>
		</v-dialog>

		<v-dialog v-model="loginConfirm.show" :max-width="loginConfirm.maxWidth">
         <v-card>
            <v-card-title>{{ loginConfirm.title }}</v-card-title>
            <v-card-text>
               {{ loginConfirm.text }}
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn  color="green darken-1" text @click="loginConfirmed">
                  OK
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
	</v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CHECK_AUTH, REFRESH_TOKEN,
ERRORS, SUCCESS, WARNING, SHOW_CONFIRM, CONFIRM_LOGIN,
GO_TO_PAGE } from '@/store/actions.type';
import { SET_WINDOW_WIDTH, SET_RESPONSIVE, SET_CHECKING_AUTH } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'App',
	data() {
		return {
			title: '',
			
			success: {
				color: 'info',
				show: false,
				timeout: 1500,
				msg: '存檔成功'
			},
			loginConfirm: {
				maxWidth: DIALOG_MAX_WIDTH,
				color: 'info',
				show: false,
				title: '需要登入',
				text: '您目前執行的程序需要登入.',
				returnUrl: ''
			},

			confirm: {
            type: false,
            title: '',
            text: '',
            active: false,
            action: '',
            maxWidth: DIALOG_MAX_WIDTH,
            ok_text: '確定',
            cancel_text: '取消',
            on_ok: null,
            on_cancel: null
			}			
			
		}
	},
	computed: {
		...mapGetters(['currentUser', 'checkingAuth', 'responsive','contentMaxWidth']),
		confirmNoAction() {
			return !this.confirm.on_ok && !this.confirm.on_cancel
		}
	},
	created() { 
		Bus.$on(GO_TO_PAGE, this.goToPage);

		Bus.$on(ERRORS, this.onError);
		Bus.$on(SUCCESS, this.onSuccess);
		Bus.$on(WARNING, this.onWarning);
		Bus.$on(SHOW_CONFIRM, this.showConfirm);
		Bus.$on(CONFIRM_LOGIN, this.confirmLogin);
	},
	mounted() {
		if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);

      this.onResponsiveInverted();
		window.addEventListener('resize', this.onResponsiveInverted);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResponsiveInverted);
	},
	methods: {
		goToPage({ name = '', path = '' }) {
			if(name) {
				if(name === this.$route.name) window.location.reload();
				else this.$router.push({ name });
			}else if(path) {
				if(path === this.$route.path) window.location.reload();
				else this.$router.push({ path });
			}
		},
		onError(error) {
			let confirm = {
				type: 'error',
				title: '伺服器暫時無回應，請稍候再試.',
				text: ''
			};
			
			if(error) {
				confirm.title = error.title ? error.title : '伺服器暫時無回應，請稍候再試.';
				confirm.text = error.text ? error.text : '';

				let status = error.status;
				
				if(status) {
					if(status === 401) {
						this.onFourZeroOne();
					}else if(status === 403){
						this.onForbidden();
					}else {
						this.showConfirm(confirm);
					}
				}else {
					// no status code
					this.showConfirm(confirm);
				}
			}else {
				// no error data
				this.showConfirm(confirm);
			}
		},
		onFourZeroOne() {
			if(this.checkingAuth) return;

			this.$store.commit(SET_CHECKING_AUTH, true);
			if(this.currentUser) {
				this.reLogin(() => {
					this.showConfirm({
						type: '',
						title: '請重新操作',
						text: '您的驗証剛剛刷新，請重新操作一次'
					});
					this.$store.commit(SET_CHECKING_AUTH, false);
				});
			}else {
				this.$store.commit(SET_CHECKING_AUTH, false);
				this.redirectToLogin(this.$route.path);
			}
			
		},
		onForbidden() {
			this.showConfirm({
				type: '',
				title: '權限不足',
				text: '此功能限訂閱會員使用',
				ok: '確定',
				cancel: '',
				onOk: () => {
					this.$router.push({ name: 'subscribes' });
				}
			});
		},
		reLogin(callback = null) {
			//重新登入
			this.$store.dispatch(REFRESH_TOKEN).then(token => {
				if(token) {
					if(callback) callback();
				} 
				else this.redirectToLogin(this.$route.path);
			})
		},
		redirectToLogin(returnUrl = '/') {
			this.$router.push({ name: 'login', query: { returnUrl } });
		},
		onSuccess(msg) {
			this.success.icon = 'mdi-check-circle';
			this.success.color = 'success';
			this.success.msg = msg ? msg : '存檔成功';
			this.success.show = true;
		},
		onWarning(msg){
			if(msg) {
				this.success.icon = 'mdi-alert-circle';
				this.success.color = 'warning';
				this.success.msg = msg;
				this.success.show = true;
			}
		},
		showConfirm({type, title, text, ok ='確定', cancel = '取消', onOk = null, onCancel = null, maxWidth = 0 }) {
			
			this.confirm = {
            type,
            title,
				text,
				maxWidth: maxWidth ? maxWidth : DIALOG_MAX_WIDTH,
            ok_text: ok,
            cancel_text: cancel,
            active: true,
            on_ok: onOk,
            on_cancel: onCancel
			};
			
      },
      hideConfirm() {
         this.confirm = {
            type: '',
            title: '',
            text: '',
            ok_text: '確定',
            cancel_text: '取消',
            maxWidth: DIALOG_MAX_WIDTH,
            active: false,
            on_ok: null,
            on_cancel: null
         };
      },
		confirmLogin(data) {
			if(data) {
				this.loginConfirm.title = data.title ? data.title : '需要登入';
				this.loginConfirm.text = data.text ? data.text : '您目前執行的程序需要登入';
				this.loginConfirm.returnUrl = data.returnUrl ? data.returnUrl : '/';
			}
			this.loginConfirm.maxWidth = DIALOG_MAX_WIDTH;
			this.loginConfirm.show = true;
		},
		loginConfirmed() {
			this.redirectToLogin(this.loginConfirm.returnUrl);

			this.loginConfirm.show = false;
		},
		onResponsiveInverted () {
			if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);
			
         if(window.innerWidth < 991) {
            this.$store.commit(SET_RESPONSIVE, true);
         }else {
            this.$store.commit(SET_RESPONSIVE, false);
         }
      }
	}
};
</script>


<style lang="scss">
* :not(.v-icon) {
  font-family: "微軟正黑體",sans-serif!important;
}
html {
  scroll-behavior: smooth;
}

article img{
	display: block;
	max-width:  100%;
	height: auto;
}

a {
	text-decoration: none;
}

.inline-emoji {
	float: left;
	margin-right: .5em;
	width: 22px;
	height: 22px;
}
.article-imgDesc {
	color: darkorange;
	margin-top: 1em;
}
.article-imgDesc > li {
	margin-bottom : 3px;
}

.errText{
	color: #fff;
}
.successText{
	font-size: 1.2rem;
	color: #fff;
}
.center-helper {
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}
.img-center {
	display: block;
	margin: auto;
}

.a-btn {
  text-decoration: none;
}

.q-title {
	font-size: 16px;
}


.custom-table {
	border-collapse: collapse;
   width: 100%;
}
.custom-table td, .custom-table th {
  border: 1px solid #ddd;
  padding: 8px;
}
.custom-table tr:nth-child(even){background-color: #f2f2f2;}

.custom-table tr:hover {background-color: #ddd;}

.custom-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
.cn {
	font-family: "微軟正黑體"
}
.item-price {
	color: #ee4d2d;
   font-weight: 400;	
}
.price-number{
	font-size: 155%;
	max-width: 130px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>