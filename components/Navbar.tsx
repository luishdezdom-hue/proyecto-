import React from 'react';
import { ViewState } from '../types';
import { 
  Newspaper, 
  CalendarDays, 
  UserX, 
  Trophy, 
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { view: ViewState.NEWS, label: 'Noticias', icon: Newspaper },
    { view: ViewState.CALENDAR, label: 'Agenda', icon: CalendarDays },
    { view: ViewState.ATTENDANCE, label: 'Asistencia Docente', icon: UserX },
    { view: ViewState.TOURNAMENTS, label: 'Torneos', icon: Trophy },
  ];

  return (
    <nav className="bg-[#FF8FE9] text-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(ViewState.NEWS)}>
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="font-bold text-xl tracking-tight text-white">UMB Atenco</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === item.view
                      ? 'bg-white/30 text-white shadow-md'
                      : 'text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#ff66d9] inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#ff4dd2] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#ff76e5] pb-3 pt-2">
          <div className="px-2 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-3 rounded-md text-base font-medium ${
                  currentView === item.view
                    ? 'bg-white/30 text-white'
                    : 'text-white/90 hover:bg-white/20'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};