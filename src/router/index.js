import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import MenuMgr from '@/components/MenuMgr/MenuMgr'
import AuthorityMgr from '@/components/AuthorityMgr'
import UserMgr from '@/components/UserMgr'
import Resources from '@/components/Resources/Resources'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Main
    },
     {
      path: '/MenuMgr',
      name: 'MenuMgr',
      component: MenuMgr
    },
     {
      path: '/Resources',
      name: 'Resources',
      component: Resources
    },
     {
      path: '/AuthorityMgr',
      name: 'AuthorityMgr',
      component: AuthorityMgr
    },
     {
      path: '/UserMgr',
      name: 'UserMgr',
      component: UserMgr
    }
  ]
})
