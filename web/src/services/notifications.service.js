import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/notifications`;

const fetch = (params) => BaseService.fetch(source, params);

const clear = (model) => BaseService.post(`${source}`, model);

const details = (id) => BaseService.fetch(`${source}/${id}`);


export default { fetch, details, clear };