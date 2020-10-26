import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/posts`;

const fetch = () => BaseService.fetch(source);

const create = () => BaseService.fetch(`${source}/create`);

const store = (model) => BaseService.post(source, model);

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

export default { fetch, create, store, edit, update };