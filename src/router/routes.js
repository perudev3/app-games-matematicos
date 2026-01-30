import AuthLayout from 'layouts/AuthLayout.vue'
import MainLayout from 'layouts/MainLayout.vue'

export default [
  // LOGIN
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },

  // APP LOGUEADA
  {
    path: '/app',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: 'chat',
        component: () => import('pages/ChatPage.vue')
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue')
      }
    ]
  }
]
