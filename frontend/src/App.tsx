import { Routes, Route } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import EmployeesPage from './pages/Employees';
import AssetsPage from './pages/Assets';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen">
        <Navbar />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<EmployeesPage />} />
              <Route path="/assets" element={<AssetsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
