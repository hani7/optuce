import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Caisse from './pages/Caisse'
import Medical from './pages/Medical'
import Stocks from './pages/Stocks'
import Atelier from './pages/Atelier'
import Mutuelles from './pages/Mutuelles'
import CRM from './pages/CRM'
import Achats from './pages/Achats'
import Fournisseurs from './pages/Fournisseurs'
import Charges from './pages/Charges'
import Montures from './pages/Montures'
import Verres from './pages/Verres'
import Lentilles from './pages/Lentilles'
import Marques from './pages/Marques'
import Categories from './pages/Categories'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="caisse" element={<Caisse />} />
        <Route path="medical" element={<Medical />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="stocks/montures" element={<Montures />} />
        <Route path="stocks/verres" element={<Verres />} />
        <Route path="stocks/lentilles" element={<Lentilles />} />
        <Route path="atelier" element={<Atelier />} />
        <Route path="mutuelles" element={<Mutuelles />} />
        <Route path="crm" element={<CRM />} />
        <Route path="stats" element={<Dashboard />} />
        <Route path="achats" element={<Achats />} />
        <Route path="parametres/fournisseurs" element={<Fournisseurs />} />
        <Route path="parametres/charges" element={<Charges />} />
        <Route path="parametres/marques" element={<Marques />} />
        <Route path="parametres/categories" element={<Categories />} />
      </Route>
    </Routes>
  )
}

export default App
