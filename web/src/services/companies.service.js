import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/companies`;

const fetch = () => BaseService.fetch(source);

const create = () => BaseService.fetch(`${source}/create`);

const store = (model) => BaseService.post(source, model);

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

const update = (model) => BaseService.put(`${source}/${model.id}`, model);

const remove = (id) => BaseService.remove(`${source}/${id}`);

const top = (id) => BaseService.put(`${source}/top/${id}`);

export default { fetch, create, store, edit, update, remove, top };