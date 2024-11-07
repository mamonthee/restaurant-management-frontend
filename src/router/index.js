import { createRouter, createWebHistory } from 'vue-router'

import LoginForm from '../components/LoginForm.vue';
import Signup from '@/components/Signup.vue';
import Dashboard from '../components/Dashboard.vue';
import Menu from '@/components/Menu.vue';
import Food from '@/components/Food.vue';
import Order from '@/components/Order.vue';
import ViewOrder from '@/views/ViewOrder.vue';
import Table from '@/components/Table.vue';
import Report from '@/components/Report.vue';
import Administration from '@/components/Administration.vue';
import MinimalLayout from '@/components/MinimalLayout.vue';
import InvoiceForm from '@/components/InvoiceForm.vue';
import Kitchen from '@/components/Kitchen.vue';
const routes = [
  {
    path: '/',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path:'/signup',
    name:'SignupForm',
    component: Signup
  },
  {
    path: '/dashboard',
    name: 'DashboardPage',
    component: Dashboard // Route to the Dashboard page
  },
  {
    path:'/menu',
    name: 'MenuPage',
    component: Menu
  },
  {
    path: '/food',
    name: 'FoodPage',
    component: Food
  },
  {
    path:'/order',
    name:'OrderPage',
    component:Order
  },
  {
    path: '/viewOrder',
    name: 'ViewOrderPage',
    component: ViewOrder
  },
  {
    path: '/table',
    name: 'TablePage',
    component:Table
  },
  {
    path: '/report',
    name : 'ReportPage',
    component: Report
  },
  {
    path: '/administration',
    name: 'AdminiPage',
    component: Administration
  },
  {
    path: '/invoice/:orderId',  // Dynamic route for invoice
    name: 'InvoiceForm',
    component: InvoiceForm,
    props: true,  // This will pass the route params as props to the component
    meta: {
      requiresAuth: true // Optional: use if you have route guards
  }
  },
  {
    path: '/invoice/:orderId',
    name: 'InvoiceForm',
    component: InvoiceForm,
    props:true,
    meta: { layout: MinimalLayout }, // Use MinimalLayout for this route
  },
  {
    path: '/kitchen',
    name: 'Kitchenpage',
    component: Kitchen,
  },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
