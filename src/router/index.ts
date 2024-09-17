import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('/@/layouts/index.vue'),
    redirect: () => ({ name: 'Home' }),
    children: [
      {
        path: 'Home',
        name: 'Home',
        component: () => import('/@/views/Home.vue'),
      },
      {
        path: 'Glucose',
        name: 'Glucose',
        component: () => import('/@/views/Glucose.vue'),
      },
      {
        path: 'MomentDashboard',
        name: 'MomentDashboard',
        component: () => import('/@/views/MomentDashboard.vue'),
      },
      {
        path: 'DailyDashboard',
        name: 'DailyDashboard',
        component: () => import('/@/views/DailyDashboard.vue'),
      },
      {
        path: 'Exercise',
        name: 'Exercise',
        component: () => import('/@/views/Exercise.vue'),
      },
      {
        path: 'Strava',
        name: 'Strava',
        component: () => import('/@/views/Strava.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
