import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, KeyRound } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      <nav>
        <div className="container nav-container">
          <Link to="/" className="text-xl font-bold text-blue-600">TeamTask</Link>
          <div className="nav-links">
            <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/projects" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <FolderKanban size={18} /> Projects
            </Link>
            <div className="nav-user">
              <span className="text-sm font-medium text-slate-600">{user?.name} ({user?.role})</span>
              <Link to="/change-password" title="Change Password" className="text-slate-400 hover:text-blue-600 transition-colors">
                <KeyRound size={18} />
              </Link>
              <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow container py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
