import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthProvider';
import { GameProvider } from './context/GameProvider';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/Home/HomePage';
import { LoginPage } from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { BannersPage } from './pages/Banners/BannersPage';

function AppShell() {
  const { isAuthenticated } = useAuth();

  const content = (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/banners" element={<BannersPage />} />
        </Route>
      </Routes>
    </>
  );

  return isAuthenticated ? <GameProvider>{content}</GameProvider> : content;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
