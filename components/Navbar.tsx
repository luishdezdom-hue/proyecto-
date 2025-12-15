import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  Newspaper, 
  CalendarDays, 
  UserX, 
  Brain, 
  GraduationCap,
  Menu,
  X,
  Users,
  Star,
  ChevronDown,
  BookOpen,
  Coffee,
  Map,
  Briefcase,
  Compass,
  LogOut,
  ShieldCheck,
  Gamepad2,
  Info
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isAdmin: boolean;
  onLogout: () => void;
  enabledSections?: Record<string, boolean>;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdmin, onLogout, enabledSections = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teachersDropdownOpen, setTeachersDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleNavigate = (view: ViewState) => {
    onNavigate(view);
    setIsOpen(false);
    setTeachersDropdownOpen(false);
    setServicesDropdownOpen(false);
  };

  // Check if any child of a dropdown is enabled
  const showTeachersDropdown = 
    enabledSections[ViewState.TEACHER_INFO] || 
    enabledSections[ViewState.ATTENDANCE] || 
    enabledSections[ViewState.TEACHER_EVALUATION];

  const showServicesDropdown = 
    enabledSections[ViewState.LIBRARY] || 
    enabledSections[ViewState.CAFETERIA] || 
    enabledSections[ViewState.MAP];

  return (
    <nav className="bg-[#41F73B] text-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigate(ViewState.NEWS)}>
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="font-bold text-xl tracking-tight text-white">UMB Atenco</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => handleNavigate(ViewState.NEWS)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentView === ViewState.NEWS ? 'bg-white/30 text-white shadow-md' : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Newspaper className="h-4 w-4 mr-2" />
                Noticias
              </button>

              {enabledSections[ViewState.CALENDAR] && (
                <button
                  onClick={() => handleNavigate(ViewState.CALENDAR)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === ViewState.CALENDAR ? 'bg-white/30 text-white shadow-md' : 'text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Agenda
                </button>
              )}

              {/* Docentes Dropdown */}
              {showTeachersDropdown && (
                <div 
                  className="relative group"
                  onMouseEnter={() => setTeachersDropdownOpen(true)}
                  onMouseLeave={() => setTeachersDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      [ViewState.ATTENDANCE, ViewState.TEACHER_EVALUATION, ViewState.TEACHER_INFO].includes(currentView) 
                        ? 'bg-white/30 text-white shadow-md' 
                        : 'text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Docentes
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 origin-top-left ${teachersDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="py-1">
                      {enabledSections[ViewState.TEACHER_INFO] && (
                        <button
                          onClick={() => handleNavigate(ViewState.TEACHER_INFO)}
                          className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 w-full text-left"
                        >
                          <Info className="h-4 w-4 mr-2 text-slate-400 group-hover:text-green-700" />
                          Inf. Docente
                        </button>
                      )}
                      {enabledSections[ViewState.ATTENDANCE] && (
                        <button
                          onClick={() => handleNavigate(ViewState.ATTENDANCE)}
                          className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 w-full text-left"
                        >
                          <UserX className="h-4 w-4 mr-2 text-slate-400 group-hover:text-green-700" />
                          Asistencia
                        </button>
                      )}
                      {enabledSections[ViewState.TEACHER_EVALUATION] && (
                        <button
                          onClick={() => handleNavigate(ViewState.TEACHER_EVALUATION)}
                          className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 w-full text-left"
                        >
                          <Star className="h-4 w-4 mr-2 text-slate-400 group-hover:text-green-700" />
                          Calificación de Docentes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {enabledSections[ViewState.ADVISORY] && (
                <button
                  onClick={() => handleNavigate(ViewState.ADVISORY)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === ViewState.ADVISORY ? 'bg-white/30 text-white shadow-md' : 'text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Asesorías
                </button>
              )}

              {/* Servicios Dropdown */}
              {showServicesDropdown && (
                <div 
                  className="relative group"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      [ViewState.LIBRARY, ViewState.CAFETERIA, ViewState.MAP].includes(currentView) 
                        ? 'bg-white/30 text-white shadow-md' 
                        : 'text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Servicios
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </button>

                  <div className={`absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 origin-top-left ${servicesDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="py-1">
                      {enabledSections[ViewState.LIBRARY] && (
                        <button
                          onClick={() => handleNavigate(ViewState.LIBRARY)}
                          className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 w-full text-left"
                        >
                          <BookOpen className="h-4 w-4 mr-2 text-slate-400 group-hover:text-green-700" />
                          Biblioteca
                        </button>
                      )}
                      {enabledSections[ViewState.CAFETERIA] && (
                        <button
                          onClick={() => handleNavigate(ViewState.CAFETERIA)}
                          className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 w-full text-left"
                        >
                          <Coffee className="h-4 w-4 mr-2 text-slate-400 group-hover:text-green-700" />
                          Cafetería
                        </button>
                      )}
                      {enabledSections[ViewState.MAP] && (
                        <button
                          onClick={() => handleNavigate(ViewState.MAP)}
                          className="group flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 w-full text-left"
                        >
                          <Map className="h-4 w-4 mr-2 text-slate-400 group-hover:text-green-700" />
                          Mapa del Campus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {enabledSections[ViewState.CAREER_GUIDANCE] && (
                 <button
                  onClick={() => handleNavigate(ViewState.CAREER_GUIDANCE)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === ViewState.CAREER_GUIDANCE ? 'bg-white/30 text-white shadow-md' : 'text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Compass className="h-4 w-4 mr-2" />
                  Orientación
                </button>
              )}

              {!isAdmin && enabledSections[ViewState.GAMES] && (
                <button
                  onClick={() => handleNavigate(ViewState.GAMES)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentView === ViewState.GAMES ? 'bg-white/30 text-white shadow-md' : 'text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Juegos
                </button>
              )}
              
              {isAdmin && (
                  <button
                    onClick={() => handleNavigate(ViewState.ADMIN_DASHBOARD)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-bold border-2 border-white/50 transition-colors duration-200 ${
                      currentView === ViewState.ADMIN_DASHBOARD ? 'bg-white text-green-700 shadow-md' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Panel Admin
                  </button>
              )}

              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 ml-4 border-l border-white/20 pl-4"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>

            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden items-center space-x-2">
            <button
                onClick={onLogout}
                className="p-2 text-white/80 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-green-500 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-500 pb-3 pt-2">
          <div className="px-2 space-y-1 sm:px-3">
             {isAdmin && (
                  <button
                    onClick={() => handleNavigate(ViewState.ADMIN_DASHBOARD)}
                    className="flex items-center w-full px-3 py-3 rounded-md text-base font-bold bg-white/20 text-white border border-white/30 mb-2"
                  >
                    <ShieldCheck className="h-5 w-5 mr-3" />
                    Panel Admin
                  </button>
              )}

            <button
              onClick={() => handleNavigate(ViewState.NEWS)}
              className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
            >
              <Newspaper className="h-5 w-5 mr-3" />
              Noticias
            </button>
            
            {enabledSections[ViewState.CALENDAR] && (
              <button
                onClick={() => handleNavigate(ViewState.CALENDAR)}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
              >
                <CalendarDays className="h-5 w-5 mr-3" />
                Agenda
              </button>
            )}
            
            {/* Docentes Mobile Group */}
            {showTeachersDropdown && (
              <div className="space-y-1 pl-4 border-l-2 border-white/20 ml-2">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider pl-3">Docentes</span>
                {enabledSections[ViewState.TEACHER_INFO] && (
                  <button
                    onClick={() => handleNavigate(ViewState.TEACHER_INFO)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
                  >
                    <Info className="h-5 w-5 mr-3" />
                    Inf. Docente
                  </button>
                )}
                {enabledSections[ViewState.ATTENDANCE] && (
                  <button
                    onClick={() => handleNavigate(ViewState.ATTENDANCE)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
                  >
                    <UserX className="h-5 w-5 mr-3" />
                    Asistencia
                  </button>
                )}
                {enabledSections[ViewState.TEACHER_EVALUATION] && (
                  <button
                    onClick={() => handleNavigate(ViewState.TEACHER_EVALUATION)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
                  >
                    <Star className="h-5 w-5 mr-3" />
                    Calificación
                  </button>
                )}
              </div>
            )}

            {enabledSections[ViewState.ADVISORY] && (
              <button
                onClick={() => handleNavigate(ViewState.ADVISORY)}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
              >
                <Brain className="h-5 w-5 mr-3" />
                Asesorías
              </button>
            )}

            {/* Servicios Mobile Group */}
            {showServicesDropdown && (
              <div className="space-y-1 pl-4 border-l-2 border-white/20 ml-2 mt-2">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider pl-3">Servicios</span>
                {enabledSections[ViewState.LIBRARY] && (
                  <button
                    onClick={() => handleNavigate(ViewState.LIBRARY)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    Biblioteca
                  </button>
                )}
                {enabledSections[ViewState.CAFETERIA] && (
                  <button
                    onClick={() => handleNavigate(ViewState.CAFETERIA)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
                  >
                    <Coffee className="h-5 w-5 mr-3" />
                    Cafetería
                  </button>
                )}
                {enabledSections[ViewState.MAP] && (
                  <button
                    onClick={() => handleNavigate(ViewState.MAP)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
                  >
                    <Map className="h-5 w-5 mr-3" />
                    Mapa
                  </button>
                )}
              </div>
            )}

            {enabledSections[ViewState.CAREER_GUIDANCE] && (
              <button
                onClick={() => handleNavigate(ViewState.CAREER_GUIDANCE)}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
              >
                <Compass className="h-5 w-5 mr-3" />
                Orientación Laboral
              </button>
            )}

            {!isAdmin && enabledSections[ViewState.GAMES] && (
              <button
                onClick={() => handleNavigate(ViewState.GAMES)}
                className="flex items-center w-full px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/20"
              >
                <Gamepad2 className="h-5 w-5 mr-3" />
                Juegos
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};