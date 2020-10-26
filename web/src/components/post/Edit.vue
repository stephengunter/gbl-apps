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
			<v-row v-if="categoryOptions.length">
				<v-col cols="12">
					<v-select label="分類"
					:items="categoryOptions" v-model="model.categoryId"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<validation-provider v-slot="{ errors }" name="標題" rules="required|max:30">
						<v-text-field label="標題" v-model="model.title" required
						:error-messages="errors"
						/>
					</validation-provider>
				</v-col>
			</v-row>
			<v-row v-if="isJob">
				<v-col cols="12">
					<validation-provider v-slot="{ errors }" name="test標題" rules="required">
						<v-text-field label="test標題" v-model="model.text" required
						:error-messages="errors"
						/>
					</validation-provider>
				</v-col>
			</v-row>

			<core-error-list />

			<v-row>
				<v-col cols="6" class="text-left">
					<v-btn @click.prevent="cancel">取消</v-btn>
				</v-col>
				<v-col cols="6" class="text-right">
					<v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
   </v-card>
</validation-observer>	
</template>

<script>
import { JOBS } from '@/consts';
import { CLEAR_ERRORS } from '@/store/mutations.type';

export default {
	name: 'PostEdit',
	props: {
		category: {
			type: Object,
         default: null
		},
		model: {
			type: Object,
         default: null
		}
	},
	data() {
		return {
			categoryOptions: [],
			company: {
				title: '',
				cityId: 0,
				districtId: 0,
			},

			references: {}
		}
	},
	computed: {
		title() {
			let text = '張貼公告';
			if(this.category) return `${text}：${this.category.title}`;
			return text;	
		},
		isJob() {
			return this.category.name === JOBS;
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	beforeMount() {
		if(this.category.subItems.length) {
			this.categoryOptions = this.category.subItems.map(item => ({ value: item.id, text: item.title }));
		}else {
			this.model.categoryId = this.category.id;
		}
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
