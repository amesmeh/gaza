import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Users, Heart, Baby, ChevronDown, ChevronRight, Database,
  HandHeart, Stethoscope, Fuel as Mosque, Building, UserRoundX, HardHat,
  ClipboardList, Shield, Settings, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ activeTab, onTabChange }) => {
  const { user, checkPermission } = useAuth();
  const location = useLocation();
  const [isBasicOpen, setIsBasicOpen] = useState(true);

  // عناصر البيانات الأساسية
  const basicLinks = [
    { to: '/areas', label: 'المناطق', icon: MapPin, permission: 'view_areas' },
    { to: '/guardians', label: 'أولياء الأمور', icon: Users, permission: 'view_guardians' },
    { to: '/wives', label: 'الزوجات', icon: Heart, permission: 'view_wives' },
    { to: '/children', label: 'الأبناء', icon: Baby, permission: 'view_children' },
  ];

  // الروابط الرئيسية الأخرى
  const navLinks = [
    { to: '/martyrs', label: 'الشهداء', icon: Mosque, permission: 'view_martyrs' },
    { to: '/injured', label: 'الجرحى', icon: Stethoscope, permission: 'view_injured' },
    { to: '/medical-data', label: 'البيانات المرضية', icon: Building, permission: 'view_medical' },
    { to: '/orphans', label: 'الأيتام', icon: UserRoundX, permission: 'view_orphans' },
    { to: '/damages', label: 'أصحاب الأضرار', icon: HardHat, permission: 'view_damages' },
    { to: '/aids', label: 'المساعدات', icon: HandHeart, permission: 'view_aids' },
    { to: '/registration-requests', label: 'طلبات التسجيل', icon: ClipboardList, permission: 'view_registration_requests' },
    { to: '/users', label: 'إدارة المستخدمين', icon: Shield, permission: null, adminOnly: true },
    { to: '/settings', label: 'الإعدادات', icon: Settings, permission: null, adminOnly: true },
    { to: '/statistics', label: 'الإحصائيات', icon: BarChart3, permission: 'view_statistics' },
  ];

  return (
    <aside className="sidebar-pro">
      {/* الروابط */}
      <nav className="sidebar-pro-nav" style={{marginTop: 16}}>
        {/* البيانات الأساسية */}
        <div>
          <button
            className={`sidebar-pro-link flex justify-between items-center w-full${isBasicOpen ? ' active' : ''}`}
            style={{background: 'none', border: 'none', outline: 'none', cursor: 'pointer'}}
            onClick={() => setIsBasicOpen(v => !v)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <Database size={18} className="sidebar-pro-icon" />
              <span>البيانات الأساسية</span>
            </div>
            {isBasicOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {isBasicOpen && (
            <div style={{marginRight: 18}}>
              {basicLinks.map(link => {
                if (link.permission && !checkPermission(link.permission)) return null;
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`sidebar-pro-link${isActive ? ' active' : ''}`}
                    onClick={() => onTabChange(link.to.replace('/', '') || 'dashboard')}
                  >
                    <Icon size={16} className="sidebar-pro-icon" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {/* باقي الروابط */}
        {navLinks.map(link => {
          if (link.adminOnly && user?.role !== 'admin') return null;
          if (link.permission && !checkPermission(link.permission)) return null;
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-pro-link${isActive ? ' active' : ''}`}
              onClick={() => onTabChange(link.to.replace('/', '') || 'dashboard')}
            >
              <Icon size={18} className="sidebar-pro-icon" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};