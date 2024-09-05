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
        path: 'tails2',
        name: 'tails',
        component: () => import('/@/views/Tailwind/index.vue'),
      },
      {
        path: 'Tailwind',
        name: 'Tailwind',
        component: () => import('/@/views/Tailwind/index.vue'),
      },
      {
        path: 'Particle',
        name: 'Particle',
        component: () => import('/@/views/Particle.vue'),
      },
      {
        path: 'Dashboard',
        name: 'Dashboard',
        component: () => import('/@/views/Dashboard.vue'),
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
