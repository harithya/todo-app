import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../pages/task/HomePage.vue"
import CreateTaskPage from "../pages/task/CreateTaskPage.vue"
import TaskDetailPage from "../pages/task/TaskDetailPage.vue"
import ReportPage from "../pages/ReportPage.vue"
import AnnouncementPage from "../pages/AnnouncementPage.vue"
import AnnouncementDetailPage from "../pages/AnnouncementDetailPage.vue"
import ProfilePage from "../pages/ProfilePage.vue"
import EditProfilePage from "../pages/profile/EditProfilePage.vue"
import PasswordPage from "../pages/profile/PasswordPage.vue"
import AppearancePage from "../pages/profile/AppearancePage.vue"

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/task/buat", name: "task-create", component: CreateTaskPage, meta: { hideBottomNav: true } },
  { path: "/task/:id", name: "task-detail", component: TaskDetailPage, meta: { hideBottomNav: true } },
  { path: "/laporan", name: "report", component: ReportPage },
  { path: "/pengumuman", name: "announcement", component: AnnouncementPage },
  {
    path: "/pengumuman/:id",
    name: "announcement-detail",
    component: AnnouncementDetailPage,
    meta: { hideBottomNav: true },
  },
  { path: "/profil", name: "profile", component: ProfilePage },
  {
    path: "/profil/edit",
    name: "profile-edit",
    component: EditProfilePage,
    meta: { hideBottomNav: true },
  },
  {
    path: "/profil/kata-sandi",
    name: "profile-password",
    component: PasswordPage,
    meta: { hideBottomNav: true },
  },
  {
    path: "/profil/tampilan",
    name: "profile-appearance",
    component: AppearancePage,
    meta: { hideBottomNav: true },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
