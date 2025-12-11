import React from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Banner from './components/Banner/Banner.jsx'
import MeetingEntry from './components/MeetingEntry/MeetingEntry.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
 

  return (
   <>
   <Header />
   <Outlet />
   <Footer />
   </>
  )
}

export default App
