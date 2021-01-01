
import Layout from '@/layout'

export default {
  path: '/users',
  component: Layout,
  hidden: true,
  name: 'user',
  children: [
    {
      path: '/users/approvals',
      component: () => import('@/views/users/approvals'),
      name: 'usersApprovals',
      hidden: true,
      meta: {
        title: '用户'
      }
    },
    {
      path: '/users/info',
      component: () => import('@/views/users/info'),
      name: 'employeesInfo',
      hidden: true,
      meta: {
        name: 'employeesInfo',
        title: '我的信息'
      }
    }
  ]
}
