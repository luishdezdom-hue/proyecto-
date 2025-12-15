import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NewsSection } from './components/NewsSection';
import { CalendarSection } from './components/CalendarSection';
import { AttendanceTracker } from './components/AttendanceTracker';
import { TeacherEvaluation } from './components/TeacherEvaluation';
import { AdvisorySection } from './components/AdvisorySection';
import { LibrarySection } from './components/LibrarySection';
import { CafeteriaSection } from './components/CafeteriaSection';
import { CampusMap } from './components/CampusMap';
import { CareerGuidanceSection } from './components/CareerGuidanceSection';
import { AdminDashboard } from './components/AdminDashboard';
import { ViewState, Teacher, AbsenceRecord, UniversityEvent, EventType, AdvisoryRegistration, LibraryReservation, JobApplication, TeacherRating } from './types';
import { generateUniversityInsights } from './services/geminiService';
import { Bot, X, Lock, User, KeyRound, LogIn } from 'lucide-react';

// --- MOCK DATA SEEDING ---
const MOCK_TEACHERS: Teacher[] = [
  { id: '1', name: 'ZARCO CARRILLO FRANCISCO JAVIER', department: 'FUNDAMENTOS DE REDES DE COMPUTADORAS', photoUrl: 'https://picsum.photos/seed/zarco/100' },
  { id: '2', name: 'SANDOVAL ARGAEZ BERENICE DAFNE', department: 'INGENIERÍA FINANCIERA', photoUrl: 'https://picsum.photos/seed/sandoval/100' },
  { id: '3', name: 'MARTINEZ AVILA YADHEE', department: 'INVESTIGACIÓN DE OPERACIONES I', photoUrl: 'https://picsum.photos/seed/martinez/100' },
  { id: '4', name: 'ARIAS PERALTA HUMBERTO', department: 'COMUNICACIÓN ANALÓGICA Y DIGITAL', photoUrl: 'https://picsum.photos/seed/arias/100' },
  { id: '5', name: 'COUTIÑO DIAZ EMILIO ALFONSO', department: 'TALLER DE INVESTIGACIÓN I', photoUrl: 'https://picsum.photos/seed/coutino/100' },
  { id: '6', name: 'ALTAMIRANO ORTEGA DALIA', department: 'INGLÉS V', photoUrl: 'https://picsum.photos/seed/altamirano/100' },
  { id: '7', name: 'HERNANDEZ LARA DERLIS', department: 'ANÁLISIS Y DISEÑO DE CIRCUITOS DIGITALES', photoUrl: 'https://picsum.photos/seed/hernandez/100' },
];

const MOCK_EVENTS: UniversityEvent[] = [
  { id: 'e1', title: 'Examen Final de Álgebra', date: new Date(), type: EventType.EXAM, location: 'Aula B4' },
  { id: 'e2', title: 'Conferencia: Futuro de la IA', date: new Date(new Date().setDate(new Date().getDate() + 2)), type: EventType.LECTURE, location: 'Auditorio Principal' },
  { id: 'e3', title: 'Día del Estudiante', date: new Date(new Date().setDate(new Date().getDate() + 5)), type: EventType.HOLIDAY },
  { id: 'e4', title: 'Taller de Robótica', date: new Date(new Date().setDate(new Date().getDate() + 10)), type: EventType.WORKSHOP, location: 'Lab 3' },
];

const App: React.FC = () => {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | null>(null);
  
  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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
  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');

      if (!loginUsername) return;

      if (loginUsername === 'UMB ATENCO' && loginPassword === 'UMB ATENCO') {
          setIsAuthenticated(true);
          setUserRole('ADMIN');
          setCurrentView(ViewState.NEWS);
      } else if (loginUsername) {
          // Generic User Login (Any other username is treated as standard user for this demo)
          setIsAuthenticated(true);
          setUserRole('USER');
          setCurrentView(ViewState.NEWS);
      }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setUserRole(null);
      setLoginUsername('');
      setLoginPassword('');
      setCurrentView(ViewState.NEWS);
  };

  // --- DATA HANDLERS ---
  const handleToggleAbsence = (teacherId: string, date: Date, reason?: string) => {
    // Only Admin can modify
    if (userRole !== 'ADMIN') return;

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
                      <div className="flex gap-4 mb-6">
                          <button 
                            type="button"
                            onClick={() => { setLoginUsername(''); setLoginPassword(''); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${!loginPassword ? 'border-[#FF8FE9] text-[#d147a3] bg-pink-50' : 'border-slate-200 text-slate-400'}`}
                          >
                            Usuario
                          </button>
                          <button 
                             type="button"
                             className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${loginPassword || loginUsername === 'UMB ATENCO' ? 'border-[#FF8FE9] text-[#d147a3] bg-pink-50' : 'border-slate-200 text-slate-400'}`}
                          >
                            Administrador
                          </button>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Usuario</label>
                              <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
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
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Contraseña (Solo Admin)</label>
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
                              <p className="text-[10px] text-slate-400 mt-1 ml-1">* Deja vacío para entrar como alumno/usuario.</p>
                          </div>

                          <button 
                              type="submit"
                              className="w-full bg-[#FF8FE9] hover:bg-[#ff76e5] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-4"
                          >
                              Iniciar Sesión
                          </button>
                      </form>
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
        />;
      case ViewState.NEWS:
        return <NewsSection />;
      case ViewState.CALENDAR:
        return <CalendarSection events={events} absences={absences} teachers={teachers} onAddEvent={handleAddEvent} />;
      case ViewState.ATTENDANCE:
        return <AttendanceTracker 
            teachers={teachers} 
            absences={absences} 
            onToggleAbsence={handleToggleAbsence} 
            readOnly={userRole !== 'ADMIN'} // Users can see, Admin can edit
        />;
      case ViewState.TEACHER_EVALUATION:
        return <TeacherEvaluation teachers={teachers} onSubmitEvaluation={handleRateTeacher} />;
      case ViewState.ADVISORY:
        return <AdvisorySection onRegister={handleRegisterAdvisory} />;
      case ViewState.LIBRARY:
        return <LibrarySection onReserve={handleReserveBook} />;
      case ViewState.CAFETERIA:
        return <CafeteriaSection />;
      case ViewState.MAP:
        return <CampusMap />;
      case ViewState.CAREER_GUIDANCE:
        return <CareerGuidanceSection onSubmitJobSearch={handleJobApplication} />;
      default:
        return <NewsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isAdmin={userRole === 'ADMIN'}
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
