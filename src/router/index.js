import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/auth'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes
  })

  Router.beforeEach((to, from, next) => {
    const auth = useAuthStore() // ✅ AQUÍ SÍ

    if (to.meta.requiresAuth && !auth.user) {
      next('/login')
    } else {
      next()
    }
  })

  return Router
})
