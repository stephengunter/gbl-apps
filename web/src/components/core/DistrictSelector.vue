<template>
	<v-card>
		<v-card-title>
			<h3>{{ title }}</h3>
			<v-spacer />
         <core-icon-button v-if="districtIds.length" mode="cancel"
         @click="cancel"
         />
		</v-card-title>
		<v-card-text>
			<v-expansion-panels v-model="selected.cities.indexes" multiple>
				<v-expansion-panel v-for="(city, i) in cities" :key="i">
					<v-expansion-panel-header>
						<span v-if="selectedDistrict && selectedDistrict.cityId === city.id" class="blue--text">{{ city.title }}</span>
						<span v-else>{{ city.title }}</span>
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-row>
							<v-checkbox v-for="(district, index) in city.districts" :key="index"
							v-model="selected.districts.ids"  class="mx-2" :value="district.id" :label="district.title"
							@click="select(district.id)"
							/>
						</v-row>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-card-text>
	</v-card>		
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_DATA } from '@/store/actions.type';
import { onError, distinctValues } from '@/utils';

export default {
	name: 'DistrictSelector',
	props: {
		title: {
			type: String,
         default: '請選擇地區'
		},
		district_id: {
         type: Number,
         default: 0
		}
	},
	data() {
		return {
			selected: {
				cities: {
					items: [],
					indexes: []
				},
				districts: {
					ids: []
				},
			}
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
		selectedDistrict() {
			if(this.districtIds.length) return this.allDistricts.find(d => d.id === this.districtIds[0]);
			return null;
		},
		selectedCity() {
			if(this.selectedDistrict) return this.cities.find(c => c.id === this.selectedDistrict.cityId);
			return null;
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
	methods: {
		init() {
			if(this.district_id) {
				this.selected.districts.ids = [this.district_id];
				this.selected.cities.indexes = [this.cities.findIndex(x => x.id === this.selectedDistrict.cityId)];
			}
		},
		select(val) {
			if(this.districtIds.includes(val)) {
				this.selected.districts.ids = [val];
				this.submit();
			}
		},
		submit() {

			let district = { ...this.selectedDistrict };
			let city = { ...this.selectedCity, districts: [] };
			district.city = city;

			this.$emit('submit', district);
			
		},
		cancel() {
			this.$emit('submit', null);
		}

	}
}
</script>
