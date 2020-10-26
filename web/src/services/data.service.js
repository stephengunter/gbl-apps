import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/data`;

const fetch = () => BaseService.fetch(source);

export default { fetch };