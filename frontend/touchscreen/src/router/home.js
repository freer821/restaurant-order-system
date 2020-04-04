const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/',
    name: 'home',
    meta: {
      keepAlive: true
    },
    components: {
      default:  () => import('@/views/home/index'),
      tabbar: Tabbar
    }
  },
  {
    path: '/home/search',
    name: 'search',
    meta: {
      keepAlive: true
    },
    component: () => import('@/views/home/search')
  },
  {
    path: '/home/detail/:itemId',
    name: 'detail',
    props: true,
    component: () => import('@/views/home/detail')
  },
  {
    path: '/home/category/:itemClass',
    name: 'category',
    props: true,
    component: () => import('@/views/home/category')
  },
  {
    path: '/home/hot',
    name: 'hot',
    component: () => import('@/views/home/hot'),
    props: route => route.query
  },
  {
    path: '/home/new',
    name: 'new',
    component: () => import('@/views/home/new'),
    props: route => route.query
  },
  {
    path: '/home/groupon',
    name: 'groupon',
    component: () => import('@/views/home/groupon'),
    props: route => route.query
  },
  {
    path: '/home/brand/:brandId',
    name: 'brand',
    props: true,
    component: () => import('@/views/home/brand')
  },
  {
    path: '/home/brand-list',
    name: 'brandList',
    component: () => import('@/views/home/brand-list'),
    props: route => route.query
  },
  {
    path: '/home/topic/:topicId',
    name: 'topic',
    props: true,
    component: () => import('@/views/home/topic')
  },
  {
    path: '/home/topic-list',
    name: 'topicList',
    component: () => import('@/views/home/topic-list'),
    props: route => route.query
  }
];
