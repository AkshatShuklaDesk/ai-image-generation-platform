import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Sparkles } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Generate', icon: <LayoutDashboard size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
  ];

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <Sparkles className="sidebar-logo-icon" />
        <h2 className="text-gradient">Lumina AI</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
