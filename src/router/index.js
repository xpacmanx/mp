import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GoalsByProductView from '../views/GoalsByProductView.vue'
import GoalsByWarehouseView from '../views/GoalsByWarehouseView.vue'
import NewSupplyTaskView from '../views/NewSupplyTaskView.vue'
import NewSupplyTaskView2 from '../views/NewSupplyTaskView2.vue'
import ImageCropperDemo from '../views/ImageCropperDemo.vue'
import ConnectionsView from '../views/ConnectionsView.vue'
import WarehousesView from '../views/WarehousesView.vue'
import SupplytaskView from '../views/SupplytaskView.vue'
import AdvView from '../views/AdvView.vue'
import ProductView from '../views/ProductView.vue'
import UserListView from '../views/UserListView.vue'

import SupplytasksDashboardView from '../views/SupplytasksDashboardView.vue'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { refreshToken as refreshTokenFn, isTokenAboutToExpire } from '../tools/userState';

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
			title: 'Сервис поставок. Синхронизация. Непринятые задания.',
			requiresAuth: true
		}
	},
	{
		path: '/login',
		component: () => import('../views/LoginView.vue'),
		meta: { title: 'Login' }
	},
	// {
	// 	path: '/adv',
	// 	name: 'adv',
	// 	component: AdvView,
	// 	meta: {
	// 		title: 'Реклама',
	// 		requiresAuth: true
	// 	}
	// },
	// {
	// 	path: '/adv/:id',
	// 	name: 'adv-details',
	// 	component: () => import('../views/AdvDetailsView.vue'),
	// 	meta: {
	// 		title: 'Детали рекламы',
	// 		requiresAuth: true
	// 	}
	// },
	{
		path: '/adv',
		component: AdvView, // родитель
		meta: {
		  title: 'Реклама',
		  requiresAuth: true
		},
		children: [
		  {
			path: '', // /adv
			name: 'adv',
			component: () => import('../views/AdvListView.vue')
		  },
		  {
			path: ':id', // /adv/:id
			name: 'adv-details',
			component: () => import('../views/AdvDetailsView.vue'),
			meta: {
			  title: 'Детали рекламы',
			  requiresAuth: true
			}
		  }
		]
	},
	{
		path: '/products',
		component: ProductView, // родитель
		meta: {
		  title: 'Товары',
		  requiresAuth: true
		},
		children: [
		  {
			path: '', // /products
			name: 'products',
			component: () => import('../views/ProductListView.vue')
		  },
		  {
			path: ':id', // /products/:id
			name: 'product-details',
			component: () => import('../views/ProductDetailsView.vue'),
			meta: {
			  title: 'Аналитика товара',
			  requiresAuth: true
			}
		  }
		]
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
	{
		path: '/users',
		name: 'users',
		component: UserListView,
		meta: {
			title: 'Пользователи',
			requiresAuth: true
		}
	},
	{
		path: '/image-demo',
		name: 'image-demo',
		component: ImageCropperDemo,
		meta: {
			title: 'Демо редактора изображений',
			requiresAuth: false
		}
	},

	{
		path: '/canvas-cropper',
		name: 'canvas-cropper',
		component: () => import('../components/CanvasCropper.vue'),
		meta: {
			title: 'Canvas Image Cropper',
			requiresAuth: false
		}
	},
	{
		path: '/profile-image-test',
		name: 'profile-image-test',
		component: () => import('../views/ProfileImageTest.vue'),
		meta: {
			title: 'Тест редактора фото профиля',
			requiresAuth: false
		}
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		redirect: to => {
			console.log('404 redirect triggered for path:', to.path);
			return {
				path: '/login',
				query: { backUrl: to.fullPath }
			}
		}
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	console.log('Navigation guard triggered:', { to: to.path, from: from.path });
	
	const token = localStorage.getItem('authToken');
	const refreshToken = localStorage.getItem('refreshToken');
	
	console.log('Auth state:', { 
		hasToken: !!token, 
		hasRefreshToken: !!refreshToken,
		requiresAuth: to.meta.requiresAuth
	});

	// Helper function to safely check token expiration
	const checkTokenExpiration = (token) => {
		try {
			return isTokenAboutToExpire(token);
		} catch (error) {
			console.error('Error checking token expiration:', error);
			return true; // Assume token is expired if we can't check it
		}
	};

	try {
		// If on login page
		if (to.path === '/login') {
			if (!token || !refreshToken) {
				console.log('No tokens, proceeding to login');
				return next();
			}

			const isExpired = checkTokenExpiration(token);
			console.log('Token expiration check on login page:', { isExpired });

			if (isExpired && refreshToken) {
				console.log('Token expired on login page, attempting refresh');
				try {
					const refreshed = await refreshTokenFn();
					if (refreshed) {
						console.log('Token refreshed successfully on login page');
						return next('/');
					}
				} catch (error) {
					console.error('Token refresh failed on login page:', error);
				}
				localStorage.clear();
				return next();
			}

			if (!isExpired) {
				console.log('Valid token exists on login page, redirecting to home');
				return next('/');
			}

			return next();
		}

		// For protected routes
		if (to.meta.requiresAuth) {
			if (!token || !refreshToken) {
				console.log('No tokens for protected route');
				localStorage.clear();
				// Показываем модальное окно логина только если пользователь был авторизован ранее
				const hadToken = localStorage.getItem('hadToken') === 'true';
				if (hadToken) {
					console.log('User was authenticated before, showing login modal');
					setTimeout(() => {
						authEvents.emit('tokenExpired');
					}, 100);
				} else {
					console.log('First time user, not showing login modal');
				}
				return next(); // Разрешаем навигацию
			}

			const isExpired = checkTokenExpiration(token);
			console.log('Token expiration check for protected route:', { isExpired });

			if (isExpired) {
				console.log('Token expired for protected route, attempting refresh');
				try {
					const refreshed = await refreshTokenFn();
					if (refreshed) {
						console.log('Token refreshed successfully for protected route');
						return next();
					}
				} catch (error) {
					console.error('Token refresh failed for protected route:', error);
				}
				
				localStorage.clear();
				// Показываем модальное окно логина при потере токена
				console.log('Token lost, showing login modal');
				setTimeout(() => {
					authEvents.emit('tokenExpired');
				}, 100);
				return next(); // Разрешаем навигацию, но показываем модальное окно
			}
		}

		// Update page title and proceed
		const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
		if (nearestWithTitle) {
			document.title = nearestWithTitle.meta.title;
		}

		console.log('Navigation proceeding normally');
		next();
	} catch (error) {
		console.error('Navigation guard error:', error);
		localStorage.clear();
		// Показываем модальное окно логина только если пользователь был авторизован ранее
		const hadToken = localStorage.getItem('hadToken') === 'true';
		if (hadToken) {
			console.log('Navigation error, user was authenticated before, showing login modal');
			setTimeout(() => {
				authEvents.emit('tokenExpired');
			}, 100);
		}
		return next(); // Разрешаем навигацию
	}
});

export default router
