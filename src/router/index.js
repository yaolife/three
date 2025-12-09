import { createRouter, createWebHistory } from "vue-router"

// 懒加载组件
const AllProjects = () => import("../views/AllProjects.vue")
const CalculationDetail = () => import("../views/CalculationDetail.vue")
const DataManagement = () => import("../views/DataManagement.vue")
const UserManagement = () => import("../views/UserManagement.vue")
const RiggingDetail = () => import("../views/RiggingDetail.vue")
const CraneDetail = () => import("../views/CraneDetail.vue")
const SitePlan = () => import("../views/SitePlan.vue")

const routes = [
  {
    path: "/",
    redirect: "/verification-projects",
  },
  // 兼容旧链接，统一跳转到校核计算项目
  {
    path: "/all-projects",
    redirect: "/verification-projects",
  },
  {
    path: "/verification-projects",
    name: "VerificationProjects",
    component: AllProjects,
    meta: {
      title: "校核计算项目",
      projectType: 0,
      isMenuPage: true,
    },
  },
  {
    path: "/virtual-simulation",
    name: "VirtualSimulation",
    component: AllProjects,
    meta: {
      title: "虚拟仿真项目",
      projectType: 1,
      isMenuPage: true,
    },
  },
  {
    path: "/calculation-detail/:id",
    name: "CalculationDetail",
    component: CalculationDetail,
    meta: {
      title: "起重机设计算",
      hideSidebar: true,
      hideHeader: true, // 添加隐藏顶部导航栏的元信息
    },
  },
  {
    path: "/construction-plans",
    name: "ConstructionPlans",
    component: AllProjects,
    meta: {
      title: "总平规划项目",
      projectType: 2,
      isMenuPage: true,
    },
  },
  {
    path: "/data-management",
    name: "DataManagement",
    component: DataManagement,
    meta: {
      title: "数据管理",
      isMenuPage: true,
    },
  },
  {
    path: "/user-management",
    name: "UserManagement",
    component: UserManagement,
    meta: {
      title: "账号管理",
      isMenuPage: true,
    },
  },
  {
    path: "/rigging-detail/:id?",
    name: "RiggingDetail",
    component: RiggingDetail,
    meta: {
      title: "吊索具详情",
      isEditPage: true,
      backTo: "/virtual-simulation",
    },
  },
  {
    path: "/crane-detail",
    name: "CraneDetail",
    component: CraneDetail,
    meta: {
      title: "起重机详情",
      isEditPage: true,
      backTo: "/verification-projects",
    },
  },
  {
    path: "/site-plan/:id",
    name: "SitePlan",
    component: SitePlan,
    meta: {
      title: "总平规划",
      hideSidebar: true,
      hideHeader: true,
      isEditPage: true,
      backTo: "/construction-plans",
    },
  },
  {
    path: "/calculation-detail/:id",
    name: "CalculationDetail",
    component: CalculationDetail,
    meta: {
      title: "起重机设计算",
      hideSidebar: true,
      hideHeader: true,
      isEditPage: true,
      backTo: "/verification-projects",
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
