<template>
   <div v-show="text" class="v-messages theme--light error--text">
      <div class="v-messages__wrapper">
         <div class="v-messages__message">
            {{ text }}
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      text: {
         type: String,
         default: ''
		}
	}
}
</script>