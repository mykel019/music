import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'
import Song from '@/views/Song.vue'
import Test from '@/views/Test.vue'
import useUserStore from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage-music',
    name: 'manage',
    // alias: '/manage',
    component: Manage,
    beforeEnter: () => {
      console.log('Manage guard')
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song
  },
  {
    name: 'test',
    path: '/test',
    component: Test
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home'}
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {

  if(!to.meta.requiresAuth){
    next();
    return;
  }

  const userStore = useUserStore();
  if(userStore.userLoggedIn){
    next();
  }else{
    next({ name: "home" })
  }

})

export default router
