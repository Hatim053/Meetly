import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import MeetingEntry from './components/MeetingEntry/MeetingEntry.jsx'
import CallPage from './components/CallPage/CallPage.jsx'
import ChatBox from './components/ChatBox/ChatBox.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import { Provider } from 'react-redux'
import { store } from '../app/store.js'
import Banner from './components/Banner/Banner.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: < App />,
    children : [
      {
        index : true,
        element : <Banner />
      },{
       path : '/create',
       element : <MeetingEntry />,
      }
    ]
  },
  {
    path: '/call/:roomId',
    element: <CallPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/chat-box',
    element: <ChatBox />
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>


  </StrictMode>,
)
