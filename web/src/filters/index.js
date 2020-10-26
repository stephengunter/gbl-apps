import Vue from 'vue';
import { photoNameUrl,  photoIdUrl } from '@/utils';

Vue.filter('photoNameUrl', (name, width = 0, height = 0, type = '') => {
   return photoNameUrl(name, width, height, type);
});

Vue.filter('photoIdUrl', (id, width = 0, height = 0, type = '') => {
   return photoIdUrl(id, width, height, type);
});