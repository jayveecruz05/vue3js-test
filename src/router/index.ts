import { getCookie, removeCookie } from '@/plugins/cookies';
import { createRouter, createWebHistory } from 'vue-router';

const AuthView = () => import('@/views/AuthView.vue');
const LoginView = () => import('@/components/views/AuthView/LoginView.vue');

const MainView = () => import('@/views/MainView.vue');
const PostView = () => import('@/components/views/MainView/PostView.vue');
const AboutView = () => import('@/components/views/MainView/AboutView/AboutView.vue');

const routes = [
  {
    path: '/',
    name: 'auth-view',
    redirect: { name: 'login' },
    meta: { requiresAuthentication: false },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: AuthView,
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuthentication: false }
      }
    ]
  },
  {
    path: '/',
    name: 'main-view',
    redirect: { name: 'post' },
    meta: { requiresAuthentication: true },
    component: MainView,
    children: [
      {
        path: 'post',
        name: 'post',
        meta: { requiresAuthentication: true },
        component: PostView
      },
      {
        path: 'about',
        name: 'about',
        meta: { requiresAuthentication: true },
        component: AboutView
      }
    ]
  },
  { // For 404 Page
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { path: '/' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  // console.log({ to, from, next });
  const token = getCookie('token');
  // console.log(token);
  if (to.meta.requiresAuthentication) {
    if (token) {
      next();
    } else {
      removeCookie('token');
      next({ name: 'login' });
    }
  } else {
    if (to.matched.length === 0) {
      next();
    } else if (token) {
      next({ name: 'main-view' });
    } else {
      removeCookie('token');
      next();
    }
  }
});

export default router;
