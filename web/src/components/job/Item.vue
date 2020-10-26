<template>
	<v-card>
		<v-tooltip right>
			<template v-slot:activator="{ on }">
			<v-icon v-on="on" style="margin: 0;position: absolute;top: 0;left:0;" color="yellow">mdi-star</v-icon>
			</template>
			<span>已儲存</span>
		</v-tooltip>
		<v-card-text>
			<v-row dense>
				<v-col>
					<span class="display-1 text--primary" v-text="model.title"></span>
					<br>
					<span>{{ model.date }}</span>
				</v-col>
			</v-row>
			<v-row dense class="text--primary q-title">
				<v-col>
					{{ model.company.title }}
				</v-col>
				<v-col>
					{{ model.company.location }}
				</v-col>
			</v-row>
			<v-row dense class="text--primary q-title">
				<v-col>
					<span style="font-size:1.2em">月薪 42000 起</span>
				</v-col>
			</v-row> 
   	</v-card-text>
	</v-card>
</template>

<script>

export default {
   name: 'JobCard',
   props: {
		model: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			
		}
	},
	beforeMount() {
		
	},
	methods: {
		
	}
}
</script>
