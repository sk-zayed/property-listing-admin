import { createRouter, createWebHashHistory } from "vue-router";
import { ElNotification } from "element-plus";
import LoginPage from "@/components/LoginPage.vue";
import DashBoard from "@/components/DashBoard.vue";
import UsersTable from "@/components/UsersTable.vue";
import PropertiesTable from "@/components/PropertiesTable.vue";
import store from "@/store";

const meta = {
    authorize: ["admin"],
};

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: "home",
            path: "/",
            component: DashBoard,
            meta
        },
        {
            name: "login",
            path: "/login",
            component: LoginPage
        },
        {
            name: "users",
            path: "/users",
            component: UsersTable,
            meta
        },
        {
            name: "properties",
            path: "/properties",
            component: PropertiesTable,
            meta
        }
    ],
});

router.beforeEach((to, from, next) => {
    const authorize = to.meta.authorize;
    if (authorize && !store.getters.isAuthenticated) {
        ElNotification.error({
            title: "Unauthorized!",
            message: "Please login first...",
            showClose: false,
        });
        return next({
            path: "/login"
        });
    } else {
        if (authorize && !authorize.includes(store.state.auth.role)) {
            ElNotification.error({
                title: "Insufficent access!",
                message: "You do not have sufficient access to this page...",
                showClose: false,
            });
            return next({
                path: "/",
            });
        }
    }
    next();
});

export default router;
