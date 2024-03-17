import { createWebHistory, createRouter } from "vue-router";
// импорт компонентов
import ListUsers from "./components/user/ListUsers";
import AddUser from "./components/user/AddUser";
import User from "./components/user/User";
import SearchUsers from "./components/user/SearchUsers";
import Login from "./components/authorization/Login";
import Profile from "./components/authorization/Profile";
import Register from "./components/authorization/Register";
import ListCategories from "./components/category/ListCategories";
import AddCategory from "./components/category/AddCategory";
import Category from "./components/category/Category";
import UserCategories from "./components/category/UserCategories";

import UserSpending from "./components/spending/UserSpending";
import AddUserSpending from "./components/spending/AddUserSpending";
import ListUserSpending from "./components/spending/ListUserSpending";
import SpendingElement from "./components/spending/SpendingElement";


// определяем маршруты
const routes = [
    {
        path: "/listUsers", // указание маршрута, по которому будем переходить к списку пользователей
        name: "users", // имя маршрута
        alias: "/users", // указание дополнительного маршрута
        component: ListUsers, // компонент, на основании которого будет отрисовываться страница
        meta: {
            title: "Список пользователей"
        }
    },
    {
        path: "/user/:id",
        name: "user-details",
        component: User,
        props: true, // указываем, что компонент User.vue может принимать параметры в адресной строке, например, в path указан id
        meta: {
            title: "Данные пользователя"
        }
    },
    {
        path: "/addUser",
        name: "add-user",
        component: AddUser,
        meta: {
            title: "Добавление пользователя"
        }
    },
    {
        path: "/searchUsers",
        name: "search-users",
        component: SearchUsers,
        meta: {
            title: "Поиск пользователей"
        }
    },
    {
        path: "/login",
        name: "login-user",
        component: Login,
        meta: {
            title: "Вход в систему"
        }
    },
    {
        path: "/register",
        name: "register-user",
        component: Register,
        meta: {
            title: "Регистрация"
        }
    },
    {
        path: "/profile",
        name: "profile-user",
        component: Profile,
        meta: {
            title: "Профиль пользователя"
        }
    },
    {
        path: "/listCategories",
        name: "list-categories",
        component: ListCategories,
        meta: {
            title: "Список категорий"
        }
    },
    {
        path: "/addCategory",
        name: "add-category",
        component: AddCategory,
        meta: {
            title: "Добавление категории"
        }
    },
    {
        path: "/category/:id",
        name: "category-details",
        component: Category,
        props: true,
        meta: {
            title: "Категория"
        }
    },
    {
        path: "/userCategories",
        name: "user-categories",
        component: UserCategories,
        props: true,
        meta: {
            title: "Категории пользователя"
        }
    },
    {
        path: "/userSpending",
        name: "user-spending",
        component: UserSpending,
        props: true,
        meta: {
            title: "Учёт расходов"
        }
    },
    {
        path: "/addUserSpending",
        name: "add-user-spending",
        component: AddUserSpending,
        props: true,
        meta: {
            title: "Добавление расходов"
        }
    },
    {
        path: "/listUserSpending",
        name: "list-user-spending",
        component: ListUserSpending,
        props: true,
        meta: {
            title: "Список расходов"
        }
    },
    {
        path: "/userSpending/:id",
        name: "user-spending-element",
        component: SpendingElement,
        props: true,
        meta: {
            title: "Расход"
        }
    }
];

const router = createRouter({
    history: createWebHistory(), // указываем, что будет создаваться история посещений веб-страниц
    routes, // подключаем маршрутизацию
});

// указание заголовка компонентам (тега title), заголовки определены в meta
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    next();
});

export default router;