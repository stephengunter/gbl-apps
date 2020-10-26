import Vue from 'vue';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate';
import {
  email,
  max,
  min,
  integer,
  numeric,
  required,
} from 'vee-validate/dist/rules';

setInteractionMode('eager');


extend('required', {
  ...required,
  message: '必須填寫{_field_}',
});
extend('numeric', {
  ...numeric,
  message: '{_field_}必須為數字',
});
extend('integer', {
  ...integer,
  message: '{_field_}必須為數字',
});
extend('email', {
  ...email,
  message: 'Email 格式不正確',
});
extend('max', {
  ...max,
  message: '{_field_}長度上限{length}個字',
});
extend('min', {
  ...min,
  message: '{_field_}長度要求{length}個字以上',
});

Vue.component('validation-provider', ValidationProvider);
Vue.component('validation-observer', ValidationObserver);
