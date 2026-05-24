import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        SalaryMgmt
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/employees" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Employees</span>
        </NavLink>
      </nav>
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="text-xs text-muted">
          HR Persona Tool
        </div>
      </div>
    </aside>
  );
}
