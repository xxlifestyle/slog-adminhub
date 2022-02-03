import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login/Login";
import ShipmentPoints from "@/views/ShipmentPoints/ShipmentPoints";
import Company from "@/views/Company/Company";
import Users from "@/views/Users/Users";

const routes = [
  {
    path: "/",
    name: "ShipmentPoints",
    component: ShipmentPoints,
    meta: {
      requiresAuth: true,
    }
  },

  {
    path: "/company",
    name: "Company",
    component: Company,
    meta: { requiresAuth: true, },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: { requiresAuth: true, },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { notRequiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = window.localStorage.getItem("token");
  const requieAuth = to.matched.some((todo) => todo.meta.requiresAuth);
  const notRequieAuth = to.matched.some((todo) => todo.meta.notRequiresAuth);

  if (notRequieAuth && currentUser) {
    next("/");
  }

  if (requieAuth && !currentUser) {
    next("/login");
  } else {
    next();
  }
});

export default router;
