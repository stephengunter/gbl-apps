<template>
	<v-main>
		<div class="main-container">
			<router-view />
		</div>
		<layout-footer />
		
	</v-main>
</template>

<script>
export default {
	name: 'TheContainer'
}
</script>

<style>
.main-container {
   padding-bottom: 100px;
}
</style>
