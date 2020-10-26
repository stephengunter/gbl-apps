<template>
	<v-card>
		<v-card-title>
			<h3>{{ title }}</h3>
		</v-card-title>
		<v-card-text>
			<v-expansion-panels multiple>
				<v-expansion-panel v-for="(city, i) in cities" :key="i">
					<v-expansion-panel-header>
						<v-badge v-if="districtSelectedCount(city.id) > 0"
						:content="districtSelectedCount(city.id)" left offset-y="6" 
						color="info" 
						>
							<span class="blue--text">{{ city.title }}</span>
						</v-badge>
						<span v-else>{{ city.title }}</span>
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-row>
							<v-checkbox 
							v-model="selectedAllCities"  class="mx-2" :value="city.id" :label="`${city.title}全部`"
							@click="selectAll(city.id)"
							/>
						</v-row>
						<v-row>
							<v-checkbox v-for="(district, index) in city.districts" :key="index"
							v-model="selected.districts.ids"  class="mx-2" :value="district.id" :label="district.title"
							/>
						</v-row>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card-text>
		<v-card-actions>
			<v-spacer />
			<span v-if="errText" class="red--text mr-2">{{ errText }}</span>
			<v-btn @click.prevent="submit" color="success" :disabled="hasError">
				確定
			</v-btn>
		</v-card-actions>
	</v-card>		
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_DATA } from '@/store/actions.type';
import { onError, distinctValues } from '@/utils';

export default {
	name: 'MultiDistrictSelector',
	props: {
		title: {
			type: String,
         default: '請選擇地區'
		},
		district_ids: {
         type: Array,
         default: () => []
		}	
	},
	data() {
		return {
			selectedAllCities: [],
			selected: {
				districts: {
					ids: []
				},
			},
			errText: ''
		}
	},
	computed:{
		...mapGetters(['cities']),
		allDistricts() {
			return this.cities.flatMap(c => c.districts);
		},
		districtIds() {
			return this.selected.districts.ids;
		},
		hasError() {
			if(this.errText) return true;
			return false;
		}
	},
	beforeMount() {
		if(this.cities.length) {
			this.init();
		}else {
			this.$store.dispatch(FETCH_DATA)
			.then(() => {
				this.$nextTick(this.init);
			})
			.catch(error => {
				onError(error);
			})
		}
	},
	watch: {
      districtIds: 'onSelectedChanged'
   },
	methods: {
		init() {
			if(this.district_ids.length) {
				this.selected.districts.ids = this.district_ids.slice(0);
			}
		},
		selectAll(cityId) {
			if(this.selectedAllCities.indexOf(cityId) > -1) {
				this.selectAllDistricts(cityId);
			}else {
				this.selectAllDistricts(cityId, false);
			}
		},
		selectAllDistricts(cityId, select = true) {
			let districtIds = this.cities.find(c => c.id === cityId).districts.map(d => d.id);
			districtIds.forEach(id => {
				let idx = this.districtIds.indexOf(id);
				if(idx > -1) {
					if(!select) this.districtIds.splice(idx, 1);
				}else {
					if(select) this.districtIds.push(id);
				}
			});
		},
		districtSelectedCount(cityId) {
			let districtIds = this.cities.find(c => c.id === cityId).districts.map(d => d.id);
			let includes = this.districtIds.filter(x => districtIds.includes(x));
			if(includes) return includes.length;
			else return 0;
		},
		onSelectedChanged() {
			if(this.districtIds.length) {
				this.errText = '';
			}
		},
		submit() {
			if(this.districtIds.length) {
				this.errText = '';
			}else {
				this.errText = '您尚未選擇任何地區';
			}

			let allDistricts = this.allDistricts;

			let districtIds = this.districtIds.slice(0);
			let cities = [];
			this.selectedAllCities.forEach(cityId => {
				let city = this.cities.find(c => c.id === cityId);
				cities.push(`${city.title}全部`);

				let toRemove = city.districts.map(d => d.id);
				districtIds = districtIds.filter(el => !toRemove.includes(el));
			});

			let districts = [];
			districtIds.forEach(id => {
				let district = allDistricts.find(d => d.id === id);
				districts.push(`${district.fullName}`);
			});

			this.$emit('submit', {
				cities, districts, ids: this.districtIds
			});
			
			
		}

	}
}
</script>
