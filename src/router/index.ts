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
        path: 'GlucoseTracker',
        name: 'GlucoseTracker',
        component: () => import('/@/views/GlucoseTracker.vue'),
      },
      {
        path: 'DayTracker',
        name: 'DayTracker',
        component: () => import('/@/views/DayTracker.vue'),
      },
      {
        path: 'DailyTrends',
        name: 'DailyTrends',
        component: () => import('/@/views/DailyTrends.vue'),
      },
      {
        path: 'DayTracker',
        name: 'DayTracker',
        component: () => import('/@/views/DayTracker.vue'),
      },
      {
        path: 'LowDashboard',
        name: 'LowDashboard',
        component: () => import('/@/views/LowDashboard.vue'),
      },
      {
        path: 'LowTrends',
        name: 'LowTrends',
        component: () => import('/@/views/LowTrends.vue'),
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
