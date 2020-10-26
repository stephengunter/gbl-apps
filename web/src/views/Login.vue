<template>
   <v-row align="center" justify="center">
		<v-col cols="12" sm="8" md="4">
			<v-card class="elevation-12">
				<v-toolbar  flat>
               <v-toolbar-title>登入</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-row>
						<v-col>
							<login-google 
							@success="onGoogleLoginSuccess" 
							@failed="oAuthLoginFailed"
							/>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { LOGIN } from '@/store/actions.type';
export default {
	name: 'LoginView',
	data(){
		return {
			returnUrl: '',
			returnQuery: null
		}
	},
	beforeMount() {
		if(this.$route.query) {
			this.returnUrl = this.$route.query.returnUrl ?  this.$route.query.returnUrl : '';

			let copy = JSON.parse(JSON.stringify(this.$route.query))
			delete copy['returnUrl'];
			this.returnQuery = copy;
		}
	},
	methods: {
      oAuthLoginFailed(){
         Bus.$emit('errors', { msg: '登入失敗' });
      },
      onGoogleLoginSuccess(token){
         this.$store.dispatch(LOGIN, token)
			.then(() => {
				this.onSuccess();          
			}).catch(error => {
				this.oAuthLoginFailed();
			})
      },
      onSuccess(){
         if(this.returnUrl) {
				if(this.returnQuery) this.$router.push({ path: this.returnUrl, query: this.returnQuery });
				else this.$router.push({ path: this.returnUrl });
			} 
         else this.$router.push({ path: '/' });        
      }
   }
}
</script>

<style>

</style>