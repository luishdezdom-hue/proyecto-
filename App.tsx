import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NewsSection } from './components/NewsSection';
import { CalendarSection } from './components/CalendarSection';
import { AttendanceTracker } from './components/AttendanceTracker';
import { TeacherEvaluation } from './components/TeacherEvaluation';
import { TeacherInfoSection } from './components/TeacherInfoSection';
import { AdvisorySection } from './components/AdvisorySection';
import { LibrarySection } from './components/LibrarySection';
import { CafeteriaSection } from './components/CafeteriaSection';
import { CampusMap } from './components/CampusMap';
import { CareerGuidanceSection } from './components/CareerGuidanceSection';
import { AdminDashboard } from './components/AdminDashboard';
import { GamesSection } from './components/GamesSection';
import { ViewState, Teacher, AbsenceRecord, UniversityEvent, EventType, AdvisoryRegistration, LibraryReservation, JobApplication, TeacherRating, User } from './types';
import { generateUniversityInsights } from './services/geminiService';
import { Bot, X, Lock, User as UserIcon, KeyRound, LogIn, UserPlus } from 'lucide-react';

// --- MOCK DATA SEEDING ---
const MOCK_TEACHERS: Teacher[] = [
  // TIC'S (7 Teachers)
  { 
    id: '1', 
    name: 'ZARCO CARRILLO FRANCISCO JAVIER', 
    department: 'FUNDAMENTOS DE REDES DE COMPUTADORAS', 
    photoUrl: 'https://picsum.photos/seed/zarco/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Redes y Telecomunicaciones",
    studies: "Ingeniería en Sistemas Computacionales, Maestría en Redes de Datos"
  },
  { 
    id: '4', 
    name: 'ARIAS PERALTA HUMBERTO', 
    department: 'COMUNICACIÓN ANALÓGICA Y DIGITAL', 
    photoUrl: 'https://picsum.photos/seed/arias/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Electrónica y Comunicaciones",
    studies: "Ingeniería en Electrónica, Maestría en Telecomunicaciones"
  },
  { 
    id: '7', 
    name: 'HERNANDEZ LARA DERLIS', 
    department: 'ANÁLISIS Y DISEÑO DE CIRCUITOS DIGITALES', 
    photoUrl: 'https://picsum.photos/seed/hernandez/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Sistemas Digitales y Embebidos",
    studies: "Ingeniería Mecatrónica, Especialidad en Circuitos"
  },
  { 
    id: '19', 
    name: 'JIMENEZ GARCIA ROBERTO', 
    department: 'PROGRAMACIÓN WEB', 
    photoUrl: 'https://picsum.photos/seed/roberto/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Desarrollo Full Stack",
    studies: "Ingeniería en Computación, Maestría en Tecnologías Web"
  },
  { 
    id: '20', 
    name: 'PEREZ LOPEZ ANA MARIA', 
    department: 'ADMINISTRACIÓN DE BASES DE DATOS', 
    photoUrl: 'https://picsum.photos/seed/ana/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Ciencia de Datos y Big Data",
    studies: "Licenciatura en Informática, Maestría en Ciencias de Datos"
  },
  { 
    id: '21', 
    name: 'RAMIREZ TORRES LUIS', 
    department: 'INGENIERÍA DE SOFTWARE', 
    photoUrl: 'https://picsum.photos/seed/luis/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Arquitectura de Software",
    studies: "Ingeniería de Software, Certificación PMP"
  },
  { 
    id: '22', 
    name: 'SANCHEZ GOMEZ KARLA', 
    department: 'SISTEMAS OPERATIVOS', 
    photoUrl: 'https://picsum.photos/seed/karla/100', 
    career: "Ingeniería en TIC'S",
    specialty: "Sistemas Distribuidos y Linux",
    studies: "Ingeniería Telemática, Maestría en Sistemas Computacionales"
  },

  // Ingeniería Industrial
  { 
    id: '3', 
    name: 'MARTINEZ AVILA YADHEE', 
    department: 'ADMINISTRACIÓN DE PROYECTOS', 
    photoUrl: 'https://picsum.photos/seed/martinez/100', 
    career: "Ingeniería Industrial",
    specialty: "Gestión de Proyectos",
    studies: "Ingeniería Industrial, Maestría en Administración de Empresas (MBA)"
  },
  { 
    id: '8', 
    name: 'BADILLO FLORES ALEJANDRO', 
    department: 'ADMINISTRACIÓN DE OPERACIONES II', 
    photoUrl: 'https://picsum.photos/seed/badillo/100', 
    career: "Ingeniería Industrial",
    specialty: "Logística y Cadena de Suministro",
    studies: "Ingeniería Industrial, Maestría en Logística Internacional"
  },
  { 
    id: '2', 
    name: 'SANDOVAL ARGAEZ BERENICE DAFNE', 
    department: 'INVESTIGACIÓN DE OPERACIONES I', 
    photoUrl: 'https://picsum.photos/seed/sandoval/100', 
    career: "Ingeniería Industrial",
    specialty: "Optimización de Procesos",
    studies: "Ingeniería Química Industrial, Doctorado en Investigación de Operaciones"
  },
  { 
    id: '9', 
    name: 'MARTINEZ VAZQUEZ VICTOR ISMAEL', 
    department: 'ADMINISTRACIÓN DEL MANTENIMIENTO', 
    photoUrl: 'https://picsum.photos/seed/victor/100', 
    career: "Ingeniería Industrial",
    specialty: "Mantenimiento Industrial y Seguridad",
    studies: "Ingeniería Mecánica, Especialidad en Manufactura"
  },
  { 
    id: '10', 
    name: 'ESPEJEL ALMERAYA ALDO', 
    department: 'ESTADÍSTICA II', 
    photoUrl: 'https://picsum.photos/seed/aldo/100', 
    career: "Ingeniería Industrial",
    specialty: "Estadística Aplicada y Control de Calidad",
    studies: "Licenciatura en Matemáticas Aplicadas, Maestría en Estadística"
  },
  { 
    id: '11', 
    name: 'SANCHEZ MIRANDA SANDRA', 
    department: 'ADMINISTRACIÓN DE LA CALIDAD', 
    photoUrl: 'https://picsum.photos/seed/sandra/100', 
    career: "Ingeniería Industrial",
    specialty: "Sistemas de Gestión de Calidad (ISO)",
    studies: "Ingeniería Industrial, Maestría en Calidad y Productividad"
  },
  { 
    id: '6', 
    name: 'ALTAMIRANO ORTEGA DALIA', 
    department: 'INGLÉS V', 
    photoUrl: 'https://picsum.photos/seed/altamirano/100', 
    career: "Ingeniería Industrial",
    specialty: "Enseñanza de Lenguas Extranjeras",
    studies: "Licenciatura en Lenguas Modernas, Certificación Cambridge DELTA"
  },

  // Licenciatura en Derecho
  { 
    id: '5', 
    name: 'COUTIÑO DIAZ EMILIO ALFONSO', 
    department: 'EXPRESIÓN ORAL Y ESCRITA', 
    photoUrl: 'https://picsum.photos/seed/coutino/100', 
    career: "Licenciatura en Derecho",
    specialty: "Oratoria y Argumentación Jurídica",
    studies: "Licenciatura en Derecho, Maestría en Juicios Orales"
  },
  { 
    id: '12', 
    name: 'RAMÍREZ ALAÑA JOSE LUIS', 
    department: 'FUNDAMENTOS DEL DERECHO', 
    photoUrl: 'https://picsum.photos/seed/joseluis/100', 
    career: "Licenciatura en Derecho",
    specialty: "Teoría General del Derecho",
    studies: "Licenciatura en Derecho, Doctorado en Derecho Constitucional"
  },
  { 
    id: '13', 
    name: 'CEDEÑO DORANTES SUSANA', 
    department: 'DERECHOS DE LA PERSONA', 
    photoUrl: 'https://picsum.photos/seed/susana/100', 
    career: "Licenciatura en Derecho",
    specialty: "Derecho Civil y Familiar",
    studies: "Licenciatura en Derecho, Especialidad en Derecho Civil"
  },
  { 
    id: '14', 
    name: 'RIVAS DE LA VEGA ERIKA', 
    department: 'IDENTIDAD Y CULTURA', 
    photoUrl: 'https://picsum.photos/seed/erika/100', 
    career: "Licenciatura en Derecho",
    specialty: "Sociología Jurídica",
    studies: "Licenciatura en Sociología, Maestría en Derechos Humanos"
  },
  { 
    id: '15', 
    name: 'VICTORIA RAMOS SANDRA IVARAKI', 
    department: 'ACTIVIDADES DEPORTIVAS SOCIALES Y CULTURALES', 
    photoUrl: 'https://picsum.photos/seed/victoria/100', 
    career: "Licenciatura en Derecho",
    specialty: "Desarrollo Humano",
    studies: "Licenciatura en Psicología, Maestría en Educación"
  },
  { 
    id: '16', 
    name: 'ALVAREZ PEREZ FATIMA ADRIANA', 
    department: 'INSTITUCIONES DEL DERECHO ROMANO', 
    photoUrl: 'https://picsum.photos/seed/fatima/100', 
    career: "Licenciatura en Derecho",
    specialty: "Historia del Derecho",
    studies: "Licenciatura en Derecho, Maestría en Derecho Romano"
  },
  { 
    id: '17', 
    name: 'ATLITEC GODINEZ OSCAR CRISTOPHE', 
    department: 'TEORÍA DEL ESTADO', 
    photoUrl: 'https://picsum.photos/seed/oscar/100', 
    career: "Licenciatura en Derecho",
    specialty: "Derecho Constitucional y Administrativo",
    studies: "Licenciatura en Ciencias Políticas, Doctorado en Derecho Público"
  },
  { 
    id: '18', 
    name: 'RAMIREZ ALAÑA JOSE ALEJANDRO', 
    department: 'FUNDAMENTOS DE DERECHOS HUMANOS', 
    photoUrl: 'https://picsum.photos/seed/josealejandro/100', 
    career: "Licenciatura en Derecho",
    specialty: "Derecho Internacional de los DDHH",
    studies: "Licenciatura en Derecho, Maestría en Derechos Humanos y Democracia"
  },
];

const MOCK_EVENTS: UniversityEvent[] = [
  { id: 'e1', title: 'Examen Final de Álgebra', date: new Date(), type: EventType.EXAM, location: 'Aula B4', career: "Ingeniería Industrial" },
  { id: 'e2', title: 'Conferencia: Futuro de la IA', date: new Date(new Date().setDate(new Date().getDate() + 2)), type: EventType.LECTURE, location: 'Auditorio Principal', career: "Ingeniería en TIC'S" },
  { id: 'e3', title: 'Día del Estudiante', date: new Date(new Date().setDate(new Date().getDate() + 5)), type: EventType.HOLIDAY }, // Global event
  { id: 'e4', title: 'Taller de Robótica', date: new Date(new Date().setDate(new Date().getDate() + 10)), type: EventType.WORKSHOP, location: 'Lab 3', career: "Ingeniería en TIC'S" },
];

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login/Register Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration specific
  const [regName, setRegName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regCareer, setRegCareer] = useState<string>("Ingeniería en TIC'S");

  // Database of Users (stored in Admin Dashboard)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // --- APP STATE ---
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.NEWS);
  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [events, setEvents] = useState<UniversityEvent[]>(MOCK_EVENTS);

  // --- COLLECTED DATA STATE (For Admin Dashboard) ---
  const [advisoryRegistrations, setAdvisoryRegistrations] = useState<AdvisoryRegistration[]>([]);
  const [libraryReservations, setLibraryReservations] = useState<LibraryReservation[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [teacherRatings, setTeacherRatings] = useState<TeacherRating[]>([]);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- AUTH HANDLERS ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (registeredUsers.some(u => u.username === regUser)) {
      setLoginError('El usuario ya existe');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: regName,
      username: regUser,
      password: regPass,
      role: 'STUDENT',
      career: regCareer
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    setIsRegistering(false);
    setLoginUsername(regUser);
    setLoginPassword('');
    alert('Registro exitoso. Por favor inicia sesión.');
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');

      if (!loginUsername) return;

      // 1. Check Admin
      if (loginUsername === 'UMB ATENCO' && loginPassword === 'UMB ATENCO') {
          const adminUser: User = { id: 'admin', username: 'admin', name: 'Administrador', role: 'ADMIN' };
          setCurrentUser(adminUser);
          setIsAuthenticated(true);
          setCurrentView(ViewState.NEWS);
          return;
      }

      // 2. Check Teacher (Starts with UMB)
      if (loginUsername.startsWith('UMB')) {
         const teacherUser: User = { id: 'teacher', username: loginUsername, name: 'Docente UMB', role: 'TEACHER' };
         setCurrentUser(teacherUser);
         setIsAuthenticated(true);
         setCurrentView(ViewState.NEWS);
         return;
      }

      // 3. Check Registered Student
      const student = registeredUsers.find(u => u.username === loginUsername && u.password === loginPassword);
      if (student) {
        setCurrentUser(student);
        setIsAuthenticated(true);
        setCurrentView(ViewState.NEWS);
      } else {
        setLoginError('Credenciales incorrectas o usuario no registrado.');
      }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setLoginUsername('');
      setLoginPassword('');
      setCurrentView(ViewState.NEWS);
  };

  // --- DATA HANDLERS ---
  const handleToggleAbsence = (teacherId: string, date: Date, reason?: string) => {
    // Only Admin can modify
    if (currentUser?.role !== 'ADMIN') return;

    setAbsences(prev => {
      const exists = prev.find(a => a.teacherId === teacherId && new Date(a.date).toDateString() === date.toDateString());
      if (exists) {
        return prev.filter(a => a.id !== exists.id);
      } else {
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          teacherId,
          date,
          reason
        }];
      }
    });
  };

  const handleAddEvent = (newEvent: UniversityEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Callbacks for lifting state
  const handleRegisterAdvisory = (data: Omit<AdvisoryRegistration, 'id' | 'timestamp'>) => {
      const newReg: AdvisoryRegistration = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date()
      };
      setAdvisoryRegistrations(prev => [...prev, newReg]);
  };

  const handleReserveBook = (data: Omit<LibraryReservation, 'id' | 'timestamp'>) => {
      const newRes: LibraryReservation = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date()
      };
      setLibraryReservations(prev => [...prev, newRes]);
  };

  const handleJobApplication = (data: Omit<JobApplication, 'id' | 'timestamp'>) => {
      const newJob: JobApplication = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date()
      };
      setJobApplications(prev => [...prev, newJob]);
  };

  const handleRateTeacher = (data: TeacherRating) => {
      setTeacherRatings(prev => [...prev, data]);
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    
    setIsChatLoading(true);
    setChatResponse(null);
    const answer = await generateUniversityInsights(chatQuery);
    setChatResponse(answer);
    setIsChatLoading(false);
  };

  // --- LOGIN SCREEN RENDER ---
  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-[#FF8FE9] p-8 text-center">
                      <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <LogIn className="w-8 h-8 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-white">Bienvenido UMB Atenco</h1>
                      <p className="text-white/80 text-sm mt-2">Portal Universitario Digital</p>
                  </div>
                  
                  <div className="p-8">
                      <div className="flex border-b border-slate-200 mb-6">
                        <button 
                          className={`flex-1 py-2 text-sm font-bold ${!isRegistering ? 'text-[#FF8FE9] border-b-2 border-[#FF8FE9]' : 'text-slate-400'}`}
                          onClick={() => setIsRegistering(false)}
                        >
                          Iniciar Sesión
                        </button>
                        <button 
                          className={`flex-1 py-2 text-sm font-bold ${isRegistering ? 'text-[#FF8FE9] border-b-2 border-[#FF8FE9]' : 'text-slate-400'}`}
                          onClick={() => setIsRegistering(true)}
                        >
                          Registrar Alumno
                        </button>
                      </div>

                      {isRegistering ? (
                         <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-[#FF8FE9] outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Carrera</label>
                                <select value={regCareer} onChange={e => setRegCareer(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-[#FF8FE9] outline-none bg-white" required>
                                    <option value="Ingeniería en TIC'S">Ingeniería en TIC'S</option>
                                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                                    <option value="Licenciatura en Derecho">Licenciatura en Derecho</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Usuario</label>
                                <input type="text" value={regUser} onChange={e => setRegUser(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-[#FF8FE9] outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
                                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-[#FF8FE9] outline-none" required />
                            </div>
                            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
                            <button type="submit" className="w-full bg-[#FF8FE9] text-white font-bold py-3 rounded-xl hover:bg-[#ff76e5]">Registrarse</button>
                         </form>
                      ) : (
                        <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Usuario</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        value={loginUsername}
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                        placeholder="Nombre de usuario"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8FE9] transition-shadow"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Contraseña</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input 
                                        type="password" 
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8FE9] transition-shadow"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1">Docentes: Iniciar con usuario "UMB..."</p>
                            </div>
                            {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}

                            <button 
                                type="submit"
                                className="w-full bg-[#FF8FE9] hover:bg-[#ff76e5] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-4"
                            >
                                Iniciar Sesión
                            </button>
                        </form>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // --- MAIN APP RENDER ---
  const renderContent = () => {
    switch (currentView) {
      case ViewState.ADMIN_DASHBOARD:
        return <AdminDashboard 
            advisories={advisoryRegistrations}
            libraryReservations={libraryReservations}
            jobApplications={jobApplications}
            teacherRatings={teacherRatings}
            teachers={teachers}
            registeredUsers={registeredUsers} // Pass DB
        />;
      case ViewState.NEWS:
        return <NewsSection />;
      case ViewState.CALENDAR:
        return <CalendarSection 
          events={events} 
          absences={absences} 
          teachers={teachers} 
          onAddEvent={handleAddEvent} 
          userRole={currentUser?.role}
          userCareer={currentUser?.career}
        />;
      case ViewState.ATTENDANCE:
        return <AttendanceTracker 
            teachers={teachers} 
            absences={absences} 
            onToggleAbsence={handleToggleAbsence} 
            readOnly={currentUser?.role !== 'ADMIN'} 
        />;
      case ViewState.TEACHER_EVALUATION:
        return <TeacherEvaluation teachers={teachers} onSubmitEvaluation={handleRateTeacher} />;
      case ViewState.TEACHER_INFO:
        return <TeacherInfoSection 
          teachers={teachers} 
          userCareer={currentUser?.role === 'STUDENT' ? currentUser.career : undefined}
        />;
      case ViewState.ADVISORY:
        return <AdvisorySection 
          onRegister={handleRegisterAdvisory} 
          userCareer={currentUser?.role === 'STUDENT' ? currentUser.career : undefined}
        />;
      case ViewState.LIBRARY:
        return <LibrarySection onReserve={handleReserveBook} />;
      case ViewState.CAFETERIA:
        return <CafeteriaSection />;
      case ViewState.MAP:
        return <CampusMap />;
      case ViewState.CAREER_GUIDANCE:
        return <CareerGuidanceSection onSubmitJobSearch={handleJobApplication} />;
      case ViewState.GAMES:
        return <GamesSection />;
      default:
        return <NewsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isAdmin={currentUser?.role === 'ADMIN'}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} UMB Atenco Portal. Todos los derechos reservados.
        </div>
      </footer>

      {/* Floating Action Button for AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-[#FF8FE9] hover:bg-[#ff76e5] text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
          >
            <Bot className="w-6 h-6" />
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col" style={{maxHeight: '500px'}}>
            <div className="bg-[#FF8FE9] p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">UMB Atenco AI Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-grow overflow-y-auto bg-slate-50 min-h-[200px]">
              {chatResponse ? (
                <div className="bg-white p-3 rounded-lg shadow-sm text-slate-700 text-sm border border-slate-100">
                  <p className="font-semibold text-[#d147a3] mb-1">AI:</p>
                  {chatResponse}
                </div>
              ) : (
                <div className="text-center text-slate-400 text-sm mt-8">
                  Pregúntame sobre horarios, ubicaciones o reglas del campus.
                </div>
              )}
              {isChatLoading && (
                <div className="flex justify-center mt-4">
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-pink-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAiAsk} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-grow text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8FE9]"
              />
              <button 
                type="submit" 
                disabled={isChatLoading || !chatQuery.trim()}
                className="bg-[#FF8FE9] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#ff76e5] disabled:opacity-50"
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;