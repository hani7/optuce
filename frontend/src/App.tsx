import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Caisse from './pages/Caisse'
import Medical from './pages/Medical'
import Stocks from './pages/Stocks'
import Atelier from './pages/Atelier'
import Mutuelles from './pages/Mutuelles'
import CRM from './pages/CRM'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="caisse" element={<Caisse />} />
        <Route path="medical" element={<Medical />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="atelier" element={<Atelier />} />
        <Route path="mutuelles" element={<Mutuelles />} />
        <Route path="crm" element={<CRM />} />
        <Route path="stats" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
