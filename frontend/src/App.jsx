import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Sidebar from './components/Sidebar';
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        {token && <Sidebar onLogout={() => {
          localStorage.removeItem('token');
          setToken(null);
        }} />}
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={!token ? <Auth setToken={setToken} /> : <Navigate to="/" replace />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
