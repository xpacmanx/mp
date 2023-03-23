import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GoalsByProductView from '../views/GoalsByProductView.vue'
import GoalsByWarehouseView from '../views/GoalsByWarehouseView.vue'
import NewSupplyTaskView from '../views/NewSupplyTaskView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/newsupplytask',
    name: 'newsupplytask',
    component: NewSupplyTaskView
  },
  {
    path: '/goalsbyproduct',
    name: 'goalsbyproduct',
    component: GoalsByProductView
  },
  {
    path: '/goalsbywarehouse',
    name: 'goalsbywarehouse',
    component: GoalsByWarehouseView
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
