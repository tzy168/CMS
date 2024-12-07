import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Login from "../pages/Login";
import AuthRoute from "../components/AuthRoute"// 引入路由守卫，
import Detail from "../pages/article/detail";
import { lazy } from "react";// 路由懒加载，在需要的时候再加载
import { Suspense } from "react";//

// 路由懒加载，在需要的时候再加载
const Home = lazy(() => import("../pages/home"))
const Article = lazy(() => import("../pages/article"))
const Publish = lazy(() => import("../pages/publish"))
const User = lazy(() => import("../pages/user"))


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            {
                path: "/",
                element: <Suspense fallback={'加载中'}><Home /></Suspense>
            },
            {
                path: "article",
                element: <Suspense fallback={'加载中'}><Article /></Suspense>
            },
            {
                path: "publish",
                element: <Suspense fallback={'加载中'}><Publish /></Suspense>
            },
            {
                path: "user",
                element: <Suspense fallback={'加载中'}><User /></Suspense>
            },
            {
                path: ":id",
                Component: Detail
            }
        ]
    },
    {
        path: "/login",
        Component: Login
    }
])

export default router;