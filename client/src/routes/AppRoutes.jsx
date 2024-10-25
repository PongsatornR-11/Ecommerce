import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import History from '../pages/History'
import Checkout from '../pages/Checkout'
import Login from '../pages/auth/login'
import Register from '../pages/auth/Register'
import Layout from '../layouts/Layout'

const router = createBrowserRouter([
    { 
        path: '/', 
        element:<Layout/>,
        children:[
            { index: true, element:<Home /> },
            { path: 'shop', element:<Shop /> },
            { path: 'cart', element:<Cart />},
            { path: 'history', element:<History />},
            { path: 'checkout', element:<Checkout />},
            { path: 'login', element:<Login />},
            { path: 'register', element:<Register />},
        ]
    },
])

const AppRoutes = () => {
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default AppRoutes