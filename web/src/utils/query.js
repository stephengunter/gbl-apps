import queryString from 'query-string';

export const resolveQueryString = (params) => queryString.stringify(params);

export const buildQuery = (url, params) => {
   let queryString = resolveQueryString(params);
   if(!queryString) return url;
  
   return `${url}?${queryString}`;
}
