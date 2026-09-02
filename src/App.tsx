import { AppShell } from './components/layout/AppShell'
import { AppProvider } from './core/AppContext'

export default function App() {
  return <AppProvider><AppShell /></AppProvider>
}
