import { createRouter, createWebHistory } from "vue-router"

// 懒加载组件
const Login = () => import("../views/Login.vue")
const AllProjects = () => import("../views/AllProjects.vue")
const VirtualSimulation = () => import("../views/VirtualSimulation.vue")
const CheckCalculation = () => import("../views/CheckCalculation.vue")
const ConstructionPlans = () => import("../views/ConstructionPlans.vue")
const RecycleBin = () => import("../views/RecycleBin.vue")
const CalculationDetail = () => import("../views/CalculationDetail.vue")

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "用户登录",
    },
  },
  {
    path: "/all-projects",
    name: "AllProjects",
    component: AllProjects,
    meta: {
      title: "全部项目",
    },
  },
  {
    path: "/virtual-simulation",
    name: "VirtualSimulation",
    component: VirtualSimulation,
    meta: {
      title: "虚拟仿真项目",
    },
  },
  {
    path: "/check-calculation",
    name: "CheckCalculation",
    component: CheckCalculation,
    meta: {
      title: "校核计算",
    },
  },
  {
    path: "/calculation-detail/:id",
    name: "CalculationDetail",
    component: CalculationDetail,
    meta: {
      title: "起重机设计算",
      hideSidebar: true,
      hideHeader: true  // 添加隐藏顶部导航栏的元信息
    },
  },
  {
    path: "/construction-plans",
    name: "ConstructionPlans",
    component: ConstructionPlans,
    meta: {
      title: "施工平立面图",
    },
  },
  {
    path: "/recycle-bin",
    name: "RecycleBin",
    component: RecycleBin,
    meta: {
      title: "回收站",
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + " - 光热三维施工仿真软件"
  }
  next()
})

export default router