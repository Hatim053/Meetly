import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import CallPage from './components/CallPage/CallPage.jsx'


const router = createBrowserRouter([
  {
    path : '/',
    element :< App />,
    children : [
      {
        index : true,
        element : <Home />,
      },
      {
        path : '/call/:roomId',
        element : <CallPage />,
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
     <App />
    </RouterProvider>
    
  </StrictMode>,
)
