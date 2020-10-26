import axios from 'axios';
import { buildQuery } from '@/utils';

const setHeader = (token) => {
	if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	else axios.defaults.headers.common['Authorization'] = null;	
}

const fetch = (url, params) => new Promise((resolve, reject) => {
	axios.get(buildQuery(url, params))
	.then(response => {
		resolve(response.data);
	})
	.catch(error => {
		reject(error.response);
	})
})

const submit = (requestType, url, data) => new Promise((resolve, reject) => {
	axios[requestType](url, data)
	.then(response => {
		resolve(response.data);
	})
	.catch(error => {
		reject(error.response);
	});
})

const post = (url, data) => submit('post', url, data);

const put = (url, data) => submit('put', url, data);

const remove = (url, data) => submit('delete', url, data);

export default { setHeader, fetch, submit, post, put, remove };