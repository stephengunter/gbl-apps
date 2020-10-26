import { 
} from '@/store/actions.type';

const actions = [
];


export const fetchViewActions = (view) => actions.length ? actions.filter(item => item.views.includes(view)) : [];