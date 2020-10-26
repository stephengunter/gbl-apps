<template>
   <v-card>
      <v-card-title>
			<h3>{{ titleText }}</h3>
         <v-spacer />
         <core-icon-button mode="cancel"
         @click="cancel"
         />
		</v-card-title>
      <v-card-text>
         <validation-observer ref="validator">
				<v-container>
               <v-row>
                  <v-col cols="12">
							<validation-provider v-slot="{ errors }" name="名稱" rules="max:20">
								<v-text-field v-model="model.title"
								label="名稱" placeholder="公司名稱 (個人可以空白)"
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
               </v-row> 
               <v-row>
                  <v-col cols="6" sm="4">
							<validation-provider v-slot="{ errors }" name="縣市" rules="required">
								<v-text-field label="縣市" readonly required
								placeholder="請選擇縣市" append-icon="mdi-map-marker"
								:value="model.address.district.fullName"
								@click="selectDistrict" @click:append="selectDistrict"
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
                  <v-col cols="6" sm="8">
                     <v-text-field v-model="model.address.street"
							label="地址" placeholder="公司地址 (個人可以空白)"
							/>
						</v-col>
               </v-row>
					<v-row>
                  <v-col cols="12">
							<validation-provider v-slot="{ errors }" name="電話" rules="required">
								<v-textarea v-model="model.phone" label="電話" outlined auto-grow required
								placeholder="如有多支電話號碼，建議換行填寫"
								rows="3" row-height="15"
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

				</v-container>
			</validation-observer>
      </v-card-text>
      <v-dialog scrollable persistent
		v-model="districtSelect.active" :max-width="districtSelect.maxWidth"
		>
			<core-district-selector title="請選擇縣市"
			:district_id="model.address.district.id"
			@submit="onDistrictSelected"
			/>
      </v-dialog>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERRORS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { addErrorMsg } from '@/utils';

export default {
   name: 'UserCompanyEdit',
   props: {
      model: {
         type: Object,
         default: null
		},
      title: {
         type: String,
         default: ''
		}
   },
   data () {
		return {
         districtSelect: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },
			references: {}
		}
   },
   computed: {
		...mapGetters(['cities','contentMaxWidth']),
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
      },
      titleText() {
			let text = this.model.id ? `編輯${this.title}` : `新增${this.title}`;
			if(this.model.parentId) text += ' - 子公司';
			return text;
      }
   },
   mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		selectDistrict() {
			this.districtSelect.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.districtSelect.active = true;
		},
		onDistrictSelected(district) {
			if(district) {
				this.model.address.district = { ...district };
			}
			this.districtSelect.active = false;
		},
		addDistrictError(msg) {
			addErrorMsg(this.validator, '縣市', msg);
		},
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
				if(valid) {
					if(!this.model.address.district.id) {
						this.addDistrictError('請選擇縣市');
						return;
					}
					this.$emit('save');
				} 
         })
		}
   }
}
</script>

<style>

</style>