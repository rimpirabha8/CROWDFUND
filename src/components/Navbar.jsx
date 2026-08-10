import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, PlusCircle, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <Rocket className="text-indigo-400" size={28} style={{ color: '#6366f1' }} />
          <span>Fund<span className="gradient-text">Pulse</span></span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/discover" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Discover Projects
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/create" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Start a Campaign
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="btn btn-secondary btn-sm" title="Dashboard">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="nav-actions" style={{ gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} />
                <span>Log In</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
