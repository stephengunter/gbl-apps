import Errors from '@/common/errors';

export const addErrorMsg = (validator, key, msg) => {
   let errors = { ...validator.errors };
   errors[key] = [msg];
   validator.setErrors(errors);
}


export const getErrorMsg = (errors, key) => {
   if(errors) {
      return errors.hasOwnProperty(key) ? errors[key][0] : '';
   }
   return  '';
}

export const clearErrors = (errors, keys = []) => {
   keys.forEach(key => {
      if(errors.hasOwnProperty(key)) errors[key] = [];
   })
	return errors;
}