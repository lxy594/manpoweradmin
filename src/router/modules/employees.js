import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  meta: { title: '员工菜单' },
  children: [{
    name: 'employees',
    path: '',
    component: () => import('@/views/employees/index'),
    meta: { title: '员工', icon: 'user' }
  },
  {
    path: 'detail/:id',
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: { title: '员工详情页' }
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '打印'
    }
  }]
}
