export const PRODUCTION = false;
export const SITE_URL = PRODUCTION ? 'https://gbl.com' : 'http://localhost:8080';
export const SITE_TITLE = '公布欄';
export const LOGO_SRC = './img/logo.png';
export const API_URL = PRODUCTION ? 'https://api.gbl.com' : 'http://localhost:51368';

//AUTH
export const GOOGLE_AUTH_PARAMS = {
   client_id: PRODUCTION ? '54788512269-m8q9l3r9rr9igji0vge4iskub6e8t5ce.apps.googleusercontent.com' : '753186496069-ru78fhjhbdvif7dqhskiq8j3ln9ab777.apps.googleusercontent.com',
   scope: 'email'
};

export const GOOGLE_RECAPTCHA_PARAMS = {
   sitekey: PRODUCTION ? '6Leeu_QUAAAAAGZf2QcUPkexxklK3Rkj__qL-Kj7' : '6LeWpPMUAAAAAFEPuds36P9BawyiymYtZDo2eynh'  
};

//UI
export const DIALOG_MAX_WIDTH = 420;

//USER_COMPANIES 
export const USER_COMPANIES = {
   max: 3
};