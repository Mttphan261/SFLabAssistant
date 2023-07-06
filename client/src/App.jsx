import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import Home from './components/pages/Home.jsx'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" index element = {<Home />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
