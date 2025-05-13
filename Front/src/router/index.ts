import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Upload from '../pages/Upload.vue'
import Dashboard from '../pages/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/upload', component: Upload, meta: { requiresAuth: true } },
    { path: '/dashboard', component: Dashboard, meta: { requiresAdmin: true } },
  ]
})

// Simu temporaire d'une session (à remplacer par une vraie session backend)
const fakeSession = {
  username: null,
  isAdmin: false,
  isWhitelisted: false
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !fakeSession.isWhitelisted && !fakeSession.isAdmin) {
    next('/login')
  } else if (to.meta.requiresAdmin && !fakeSession.isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router
