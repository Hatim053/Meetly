import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import MeetingEntry from './components/MeetingEntry/MeetingEntry.jsx'
import CallPage from './components/CallPage/CallPage.jsx'
import ChatBox from './components/ChatBox/ChatBox.jsx'
import { Provider } from 'react-redux'
import { store } from '../app/store.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: < App />,
    children: [
      {
        index: true,
        element: <MeetingEntry />,
      },
      {
        path: '/call/:roomId',
        element: <CallPage />,
      }
    ]
  },
  {
    path: '/chat-box',
    element: <ChatBox />
  }
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
