import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Scanner from "./pages/Scanner"
import CreateItems from "./pages/CreateItems"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/items/scanner" element={<Scanner />} />
      <Route path="/items/create" element={<CreateItems />} />
    </Routes>
  )
}

export default App
