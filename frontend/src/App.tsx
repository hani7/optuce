import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDossier from './pages/PatientDossier'
import ExamenForm from './pages/ExamenForm'
import Montures from './pages/Montures'
import Verres from './pages/Verres'
import Lentilles from './pages/Lentilles'
import Ventes from './pages/Ventes'
import POS from './pages/POS'
import Devis from './pages/Devis'
import ClotureCaisse from './pages/ClotureCaisse'
import CHIFA from './pages/CHIFA'
import CommandesVerres from './pages/CommandesVerres'
import SAV from './pages/SAV'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { useAuthStore } from './store/auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDossier />} />
        <Route path="examens/nouveau" element={<ExamenForm />} />
        <Route path="stock/montures" element={<Montures />} />
        <Route path="stock/verres" element={<Verres />} />
        <Route path="stock/lentilles" element={<Lentilles />} />
        <Route path="ventes" element={<Ventes />} />
        <Route path="ventes/nouvelle" element={<POS />} />
        <Route path="devis" element={<Devis />} />
        <Route path="caisse/cloture" element={<ClotureCaisse />} />
        <Route path="chifa" element={<CHIFA />} />
        <Route path="commandes" element={<CommandesVerres />} />
        <Route path="sav" element={<SAV />} />
        <Route path="parametres" element={<Settings />} />
      </Route>
    </Routes>
  )
}
