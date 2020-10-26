export const showConfirm = ({ type, title, text, ok ='確定', cancel = '取消', onOk = null, onCancel = null,maxWidth = 0}) => {
  Bus.$emit('show-confirm', { type, title, text, ok, cancel, onOk, onCancel });
}

export const activeOptions = () => {
   return [{
      value: true,
      text: '上架中'
   },{
      value: false,
      text: '已下架'
   }];
}


export const uuid = (len = 8, radix = 16) => {
   let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
   let uuid = [], i;
   radix = radix || chars.length;

   if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
   }else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
         if (!uuid[i]) {
            r = 0 | Math.random()*16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
         }
      }
   }

   return uuid.join('');
}


export * from './helper';
export * from './datetime';
export * from './actions';
export * from './query';
export * from './route';
export * from './validator';