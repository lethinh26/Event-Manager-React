import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RegisterPage from '../pages/Authentication/RegisterPage'
import LoginPage from '../pages/Authentication/LoginPage'
import LayoutMain from '../pages/Layout/LayoutMain'
import DashboardHome from '../pages/Dashboard/DashboardHome'

const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage/>
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/dashboard",
    element: <LayoutMain/>,
    children: [
      {index: true, element: <DashboardHome/>}
    ]
  },
  {
    path: "*",
    element: <LoginPage/>
  },
])

const RouterConfig = () => {
  return <RouterProvider router={router}/>
}

export default RouterConfig
