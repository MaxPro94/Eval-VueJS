import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: () => import('../views/AccueilView.vue'),
    },
    {
      path: '/factures',
      name: 'factures',
      component: () => import('../views/FacturesListView.vue'),
    },
    {
      path: '/factures/edit/:id',
      name: 'facturesEdit',
      props: true,
      component: () => import('../views/FacturesEditView.vue'),
    },
    {
      path: '/factures/create',
      name: 'facturesCreate',
      props: true,
      component: () => import('../views/FacturesCreateView.vue'),
    },
    {
      path: '/facturesDelete/:id',
      name: 'FacturesDelete',
      props: true,
    }
  ],
})

export default router
