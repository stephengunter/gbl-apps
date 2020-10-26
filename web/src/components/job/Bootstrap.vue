<template>
<validation-observer ref="validator">
	<v-card>
		<v-card-title>
			<h3>{{ title }}</h3>
			<v-spacer />
         <core-icon-button mode="cancel"
         @click="cancel"
         />
		</v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<validation-provider v-slot="{ errors }" name="標題" rules="required|max:30">
						<v-text-field label="標題" v-model="model.title" required
						:error-messages="errors"
						/>
					</validation-provider>
				</v-col>
			</v-row>
			

			<core-error-list />
         <v-row>
            <v-col cols="6" class="text-left">
            </v-col>
            <v-col cols="6" class="text-right">
               <v-btn @click.prevent="onSubmit" color="success">確定</v-btn>
            </v-col>
         </v-row>
		</v-card-text>
   </v-card>
</validation-observer>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERRORS } from '@/store/mutations.type';

export default {
	name: 'JobBootstrap',
	props: {
      title: {
			type: String,
         default: ''
      },
		model: {
			type: Object,
         default: null
      }
	},
	data() {
		return {
			company: {
				title: '',
				cityId: 0,
				districtId: 0,
			},
			references: {}
		}
	},
	computed: {
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	beforeMount() {
		
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		cancel() {
			this.clearErrors();
			this.$emit('cancel');
		},
		clearErrors() {
			this.validator.setErrors({});
			this.$store.commit(CLEAR_ERRORS);
		},
		onSubmit() {
			this.clearErrors();
			this.validator.validate().then(valid => {
				console.log('valid', valid);
         })
		}
	}
}
</script>
