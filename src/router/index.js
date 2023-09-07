import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GoalsByProductView from '../views/GoalsByProductView.vue'
import GoalsByWarehouseView from '../views/GoalsByWarehouseView.vue'
import NewSupplyTaskView from '../views/NewSupplyTaskView.vue'
import NewSupplyTaskView2 from '../views/NewSupplyTaskView2.vue'
import ConnectionsView from '../views/ConnectionsView.vue'
import WarehousesView from '../views/WarehousesView.vue'
import SupplytaskView from '../views/SupplytaskView.vue'
import SupplytasksDashboardView from '../views/SupplytasksDashboardView.vue'


const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
		meta: {
			title: 'Home Dashboard 1'
		}
	},
	{
		path: '/newsupplytask',
		name: 'newsupplytask',
		component: NewSupplyTaskView,
		meta: {
			title: 'Создать задание к поставкам'
		}
	},
	{
		path: '/newsupplytask/:wid',
		name: 'newsupplytaskid',
		component: NewSupplyTaskView,
		meta: {
			title: 'Создать создание к поставкам для склада'
		}
	},
	{
		path: '/newsupplytask2',
		name: 'newsupplytask2',
		component: NewSupplyTaskView2,
		meta: {
			title: 'Создать задание к поставкам'
		}
	},
	{
		path: '/newsupplytask2/:wid',
		name: 'newsupplytask2id',
		component: NewSupplyTaskView2,
		meta: {
			title: 'Создать создание к поставкам для склада'
		}
	},
	{
		path: '/supplytask/:id',
		name: 'supplytaskid',
		component: SupplytaskView,
		meta: {
			title: 'Задание к поставкам для склада'
		}
	},
	{
		path: '/supplytasks/dashboard',
		name: 'supplytaskdashboard',
		component: SupplytasksDashboardView,
		meta: {
			title: 'Панель управления Сервисом поставок'
		}
	},
	{
		path: '/goalsbyproduct',
		name: 'goalsbyproduct',
		component: GoalsByProductView,
		meta: {
			title: 'Home Dashboard 3'
		}
	},
	{
		path: '/goalsbywarehouse/:wid',
		name: 'goalsbywarehousebyid',
		component: GoalsByWarehouseView,
		meta: {
			title: '3. Get Warehouses by ID'
		}
	},
	{
		path: '/goalsbywarehouse',
		name: 'goalsbywarehouse',
		component: GoalsByWarehouseView,
		meta: {
			title: '3. Get Warehouses by ID'
		}
	},
	{
		path: '/connections',
		name: 'connections',
		component: ConnectionsView,
		meta: {
			title: 'Connections'
		}
	},
	{
		path: '/warehouses',
		name: 'warehouses',
		component: WarehousesView,
		meta: {
			title: 'Warehouses'
		}
	},
	// {
	//   path: '/about',
	//   name: 'about',
	//   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
	// }
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	// This goes through the matched routes from last to first, finding the closest route with a title.
	// e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
	// `/nested`'s will be chosen.
	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

	// Find the nearest route element with meta tags.
	const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

	const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

	// If a route with a title was found, set the document (page) title to that value.
	if (nearestWithTitle) {
		document.title = nearestWithTitle.meta.title;
	} else if (previousNearestWithMeta) {
		document.title = previousNearestWithMeta.meta.title;
	}

	// Remove any stale meta tags from the document using the key attribute we set below.
	Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

	// Skip rendering meta tags if there are none.
	if (!nearestWithMeta) return next();

	// Turn the meta tag definitions into actual elements in the head.
	nearestWithMeta.meta.metaTags.map(tagDef => {
		const tag = document.createElement('meta');

		Object.keys(tagDef).forEach(key => {
			tag.setAttribute(key, tagDef[key]);
		});

		// We use this to track which meta tags we create so we don't interfere with other ones.
		tag.setAttribute('data-vue-router-controlled', '');

		return tag;
	})
		// Add the meta tags to the document head.
		.forEach(tag => document.head.appendChild(tag));

	next();
});

export default router
