export const mapRoute = (item) => {
	return { 
		...item,  
		component: (resolve) => import(
			`@/views/${item.view}.vue`
		).then(resolve)
	}
};


export const getRouteTitle = (route) => route.meta.title ? route.meta.title : '';