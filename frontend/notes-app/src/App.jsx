import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'

const routes=(
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home/>}/>
      <Route path="/" exact element={<Login/>}/>
      <Route path="/signup" exact element={<SignUp/>}/>
    </Routes>
  </Router>
)

function App() {  
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
