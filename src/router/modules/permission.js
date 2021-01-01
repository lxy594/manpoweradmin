import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [{
    name: 'permissions',
    path: '',
    component: () => import('@/views/permission/index'),
    meta: { title: '权限管理', icon: 'lock' }
  }]
}
