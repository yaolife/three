import { createRouter, createWebHistory } from "vue-router"

// 懒加载组件
const AllProjects = () => import("../views/AllProjects.vue")
const RecycleBin = () => import("../views/RecycleBin.vue")
const CalculationDetail = () => import("../views/CalculationDetail.vue")
const DataManagement = () => import("../views/DataManagement.vue")
const RiggingDetail = () => import("../views/RiggingDetail.vue")
const CraneDetail = () => import("../views/CraneDetail.vue")
const SitePlan = () => import("../views/SitePlan.vue")

const routes = [
  {
    path: "/",
    redirect: "/all-projects",
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
    path: "/verification-projects",
    name: "VerificationProjects",
    component: AllProjects,
    meta: {
      title: "校核计算项目",
      projectType: 0,
    },
  },
  {
    path: "/virtual-simulation",
    name: "VirtualSimulation",
    component: AllProjects,
    meta: {
      title: "虚拟仿真项目",
      projectType: 1,
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
    },
  },
  {
    path: "/data-management",
    name: "DataManagement",
    component: DataManagement,
    meta: {
      title: "数据管理",
    },
  },
  {
    path: "/rigging-detail/:id?",
    name: "RiggingDetail",
    component: RiggingDetail,
    meta: {
      title: "吊索具详情",
    },
  },
  {
    path: "/crane-detail",
    name: "CraneDetail",
    component: CraneDetail,
    meta: {
      title: "起重机详情",
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
  {
    path: "/site-plan/:id",
    name: "SitePlan",
    component: SitePlan,
    meta: {
      title: "总平规划",
      hideSidebar: true,
      hideHeader: true,
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
