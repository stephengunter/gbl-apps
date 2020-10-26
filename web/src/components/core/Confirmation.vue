<template>
   <v-card>
      <v-card-title v-if="type === 'error'" class="headline red lighten-1 pb-5">
         <v-icon color="white" class="mr-1">
            mdi-alert-circle
         </v-icon>
         <span style="color: #fff;">
            {{ title  }}
         </span>
      </v-card-title>
      <v-card-title v-else v-show="title">{{ title }}</v-card-title>
         <slot>
            <v-card-text v-if="text">
            {{ text }}
            </v-card-text>
         </slot>
      <v-card-actions v-show="hasAction">
         <v-spacer></v-spacer>
         <v-btn text @click="cancel">
            {{ cancel_text }}
         </v-btn>
         <v-btn color="green darken-1" text @click="ok">
            {{ ok_text }}
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'CoreConfirmation',
   props: {
      type: {
         type: String,
         default: ''
		},
      title: {
         type: String,
         default: ''
		},
      text: {
         type: String,
         default: ''
      },
      ok_text: {
         type: String,
         default: '確定'
      },
      cancel_text: {
         type: String,
         default: '取消'
      },
      on_ok: {
         type: Function,
         default: null
      },
      on_cancel: {
         type: Function,
         default: null
      }
   },
   computed:{
      noAction() {
			return !this.on_ok && !this.on_cancel
      },
      hasAction() {
         return !this.noAction;
      }
   },
   methods: {
      ok() {
         if(this.on_ok) this.on_ok();
         this.$emit('ok');
      },
      cancel() {
         if(this.on_cancel) this.on_cancel();
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>