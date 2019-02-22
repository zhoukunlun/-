import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
// 引入css样式全局控制

// import '../assets/css/global.css'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/login', component: Login },
    // { path: '/', component: Home },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User }
      ]
    }
  ]
})
// 路由导航守卫 检测token如果不存在就跳到login登录页面
router.beforeEach((to, from, next) => {
  // 访问login 直接pass
  if (to.path === '/login') {
    return next()
  }
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next() // token 存在 继续
})

export default router
