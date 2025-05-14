// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import SelectServer from "../pages/SelectServer.vue";
import Upload from "../pages/Upload.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/select-server", component: SelectServer },
  { path: "/upload", component: Upload },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const role = localStorage.getItem("role");

  if (
    to.path === "/upload" &&
    (!role || (role !== "ami" && role !== "streamer"))
  ) {
    // Redirige vers /login si le rôle est manquant ou invalide
    return next("/login");
  }

  next(); // autorise la navigation
});

export default router;
