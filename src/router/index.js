import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GoalsByProductView from '../views/GoalsByProductView.vue'
import GoalsByWarehouseView from '../views/GoalsByWarehouseView.vue'
import NewSupplyTaskView from '../views/NewSupplyTaskView.vue'
import NewSupplyTaskView2 from '../views/NewSupplyTaskView2.vue'
import ConnectionsView from '../views/ConnectionsView.vue'
import WarehousesView from '../views/WarehousesView.vue'
import SupplytaskView from '../views/SupplytaskView.vue'
import AdvView from '../views/AdvView.vue'
import SupplytasksDashboardView from '../views/SupplytasksDashboardView.vue'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// Create a global event bus for auth events
export const authEvents = {
	listeners: new Set(),
	emit(event) {
		this.listeners.forEach(listener => listener(event));
	},
	on(callback) {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}
};

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
		meta: {
			title: 'Home Dashboard 1',
			requiresAuth: true
		}
	},
	{
		path: '/login',
		component: () => import('../views/LoginView.vue'),
		meta: { title: 'Login' }
	},
	{
		path: '/adv',
		name: 'adv',
		component: AdvView,
		meta: {
			title: 'Реклама',
			requiresAuth: true
		}
	},
	{
		path: '/adv/:id',
		name: 'adv-details',
		component: () => import('../views/AdvDetailsView.vue'),
		meta: {
			title: 'Детали рекламы',
			requiresAuth: true
		}
	},
	{
		path: '/newsupplytask',
		name: 'newsupplytask',
		component: NewSupplyTaskView,
		meta: {
			title: 'Создать задание к поставкам',
			requiresAuth: true
		}
	},
	{
		path: '/newsupplytask/:wid',
		name: 'newsupplytaskid',
		component: NewSupplyTaskView,
		meta: {
			title: 'Создать создание к поставкам для склада',
			requiresAuth: true
		}
	},
	{
		path: '/newsupplytask2',
		name: 'newsupplytask2',
		component: NewSupplyTaskView2,
		meta: {
			title: 'Создать задание к поставкам',
			requiresAuth: true
		}
	},
	{
		path: '/newsupplytask2/:wid/:taskId?',
		name: 'newsupplytask2id',
		component: NewSupplyTaskView2,
		meta: {
			title: 'Создать создание к поставкам для склада',
			requiresAuth: true
		}
	},
	{
		path: '/supplytask/:id',
		name: 'supplytaskid',
		component: SupplytaskView,
		meta: {
			title: 'Задание к поставкам для склада',
			requiresAuth: true
		}
	},
	{
		path: '/supplytasks/dashboard',
		name: 'supplytaskdashboard',
		component: SupplytasksDashboardView,
		meta: {
			title: 'Панель управления Сервисом поставок',
			requiresAuth: true
		}
	},
	{
		path: '/goalsbyproduct',
		name: 'goalsbyproduct',
		component: GoalsByProductView,
		meta: {
			title: 'Home Dashboard 3',
			requiresAuth: true
		}
	},
	{
		path: '/goalsbywarehouse/:wid',
		name: 'goalsbywarehousebyid',
		component: GoalsByWarehouseView,
		meta: {
			title: '3. Get Warehouses by ID',
			requiresAuth: true
		}
	},
	{
		path: '/goalsbywarehouse',
		name: 'goalsbywarehouse',
		component: GoalsByWarehouseView,
		meta: {
			title: '3. Get Warehouses by ID',
			requiresAuth: true
		}
	},
	{
		path: '/connections',
		name: 'connections',
		component: ConnectionsView,
		meta: {
			title: 'Connections',
			requiresAuth: true
		}
	},
	{
		path: '/warehouses',
		name: 'warehouses',
		component: WarehousesView,
		meta: {
			title: 'Warehouses',
			requiresAuth: true
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

router.beforeEach(async (to, from, next) => {
	const token = localStorage.getItem('authToken');
	const refreshToken = localStorage.getItem('refreshToken');

	// If no tokens at all and trying to access protected route, go to login
	if ((!token || !refreshToken) && to.meta.requiresAuth) {
		localStorage.clear(); // Clear any partial state
		return next({
			path: '/login',
			query: { backUrl: to.fullPath }
		});
	}

	// If on login page and no tokens, proceed
	if (to.path === '/login' && (!token && !refreshToken)) {
		return next();
	}

	const isTokenExpired = (token) => {
		if (!token) return true;
		try {
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			
			// Add a 5-minute buffer - only refresh if token expires in less than 5 minutes
			const bufferTime = 5 * 60; // 5 minutes in seconds
			return decoded.exp && (decoded.exp - bufferTime) < currentTime;
		} catch {
			return true;
		}
	};

	try {
		// Only try to refresh if we have both tokens and the access token is expired
		if (token && refreshToken && isTokenExpired(token) && !to.meta._retryRefresh) {
			try {
				const API_SERVER = import.meta.env.VITE_API_SERVER;
				const response = await axios.post(API_SERVER + '/api/token/refresh/', {
					refresh: refreshToken
				});
				const { access } = response.data;
				localStorage.setItem('authToken', access);
				
				to.meta._retryRefresh = true;
				return next();
			} catch (error) {
				// Instead of redirecting, emit an auth event
				if (from.name) { // If we're not on the initial route
					authEvents.emit('tokenExpired');
					return false; // Stop navigation
				} else {
					// If this is the initial route, redirect to login
					localStorage.clear();
					return next({
						path: '/login',
						query: { backUrl: to.fullPath }
					});
				}
			}
		}

		// For protected routes, ensure we have a valid token
		if (to.meta.requiresAuth && (!token || isTokenExpired(token))) {
			if (from.name) { // If we're not on the initial route
				authEvents.emit('tokenExpired');
				return false; // Stop navigation
			} else {
				localStorage.clear();
				return next({
					path: '/login',
					query: { backUrl: to.fullPath }
				});
			}
		}

		// Prevent authenticated users from accessing login page
		if (token && !isTokenExpired(token) && to.path === '/login') {
			const backUrl = to.query.backUrl || '/';
			return next(backUrl);
		}

		// Update page title and proceed
		const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
		if (nearestWithTitle) {
			document.title = nearestWithTitle.meta.title;
		}

		next();
	} catch (error) {
		console.error('Navigation guard error:', error);
		if (from.name) { // If we're not on the initial route
			authEvents.emit('tokenExpired');
			return false; // Stop navigation
		} else {
			localStorage.clear();
			if (to.path !== '/login') {
				return next({
					path: '/login',
					query: { backUrl: to.fullPath }
				});
			}
			next();
		}
	}
});

export default router
