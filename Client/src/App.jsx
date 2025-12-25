import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Banner from './components/Banner/Banner.jsx'
import MeetingEntry from './components/MeetingEntry/MeetingEntry.jsx'
import Footer from './components/Footer/Footer.jsx'
import FeatureCard from './components/FeatureCard/FeatureCard.jsx'
import { useLocation } from 'react-router-dom'

function App() {
 const location = useLocation()
  return (
   <>
   <Header />
   <Outlet />

   {location.pathname == '/' ? <FeatureCard /> : ''}
   <Footer />
   </>
  )
}

export default App
