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
import { ViewState, Teacher, AbsenceRecord, UniversityEvent, EventType, AdvisoryRegistration, LibraryReservation, JobApplication, TeacherRating, User, NewsItem } from './types';
import { generateUniversityInsights } from './services/geminiService';
import { Bot, X, Lock, User as UserIcon, KeyRound, LogIn, UserPlus, GraduationCap, Briefcase } from 'lucide-react';

// --- MOCK DATA SEEDING ---
const MOCK_INTERNAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Villancicos',
    summary: 'En la UES Atenco celebramos con gran entusiasmo nuestra Exposición de Villancicos, el tradicional Encendido del Árbol Navideño y el Concurso de Piñatas.',
    content: `En la UES Atenco celebramos con gran entusiasmo nuestra Exposición de Villancicos, el tradicional Encendido del Árbol Navideño y el Concurso de Piñatas, actividades que reunieron a estudiantes, docentes y personal administrativo en un ambiente de convivencia y espíritu festivo.
Estos espacios fortalecen la unión de nuestra comunidad universitaria y nos permiten compartir tradiciones que dan identidad a nuestra institución.
Agradecemos la participación de todos y reconocemos el esfuerzo y creatividad reflejados en cada presentación y elaboración de piñatas.
En la UES Atenco seguimos construyendo momentos que nos unen.
Universidad Mexiquense del Bicentenario
#ComunidadColibríUMB
#OrgullosamenteUMB#TodosSomosUMB`,
    date: '2025-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop',
    category: 'Social'
  },
  {
    id: '2',
    title: 'Competencia de futbol',
    summary: 'Enhorabuena a la #ComunidadColibríUMB de la UMB UES Atenco por su participación en el Torneo de Fútbol.',
    content: `Enhorabuena a la #ComunidadColibríUMB de la UMB UES Atenco 🏫 por su participación en el Torneo de Fútbol ⚽️ (varonil y femenil) realizado con la finalidad de fortalecer la actividad deportiva y el trabajo en equipo entre la comunidad universitaria, contribuyendo a fortalecer su formación académica y personal. 

¡Somos #OrgullosamenteUMB!`,
    date: '2025-07-12',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    category: 'Sports'
  },
  {
    id: '3',
    title: 'Concurso de spelling',
    summary: 'Tercer concurso de deletreo en inglés Spelling Bee UMB. Estudiantes de diversas regiones compitieron demostrando su habilidad.',
    content: `Tercer concurso de deletreo en inglés Spelling Bee UMB (25-26/1)

El día 1° de diciembre, se llevó a cabo el Tercer concurso de deletreo en inglés "Spelling Bee UMB", en el cual participaron los estudiantes finalistas de cada un de las cinco regiones que integran la UMB.

- Región Norte: representada por Daniel Reyes Nieto, estudiante de la UES Ixtlahuaca.
- Región Valle de Toluca: representada por Armando Alcalá Gaona, estudiante de la UES Huixquilucan.
- Región Sur: representada por Kevin Kaleb Darío Torres, estudiante de la UES Almoloya de Alquisiras.
- Región Valle de México: representada por Gael Valencia Argueta, estudiante de la UES Cuautitlán.
- Región Oriente: representada por Luis Ángel Aceves Hernández, estudiante de la UES Atenco

Asimismo, se contó con la participación del jurado conformado por las docentes Karla Fernanda Fierro Aguirre, de la Ues Tejupilco, y Karen Argelia García Floriano de la UMB Tepotzotlán, así como el docente Eder Efraín Rodríguez Ramírez de la UES Tenango del Valle. De igual manera se contó con el apoyo de la Asistente de idioma inglés, Alessandra Caroline Caceres Torres, quien fungió como pronunciadora de las palabras del concurso.

Después de diversas rondas, los finalistas demostraron su talento y su habilidad para el deletreo en inglés, desempeñándose con inteligencia y destreza, obteniendo los siguientes resultados:

- Primer Lugar: Luis Ángel Aceves Hernández, estudiante de la UES Atenco

- Segundo Lugar: Daniel Reyes Nieto, estudiante de la UES Ixtlahuaca

- Tercer Lugar: Kevin Kaleb Darío Torres, estudiante de la UES Almoloya de Alquisiras

Con esta actividad se sigue impulsando el dominio del idioma inglés entre nuestra comunidad universitaria para el desarrollo de habilidades importantes, así como para la formación integral.

#OrgullosamenteUMB
#TodosSomosUMB`,
    date: '2025-01-12',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop',
    category: 'Academic'
  }
];

const MOCK_EXTERNAL_NEWS: NewsItem[] = [
  {
    id: 'ext-1',
    title: 'Bloqueo de carretera',
    summary: 'Bloqueo total en la carretera federal Texcoco-Lechería por manifestación. Tome vías alternas.',
    content: `Atención comunidad:

Se reporta un bloqueo total en la carretera federal Texcoco-Lechería a la altura del kilómetro 25, debido a una manifestación de pobladores locales.

El tránsito se encuentra detenido en ambos sentidos. Se recomienda utilizar la autopista Peñón-Texcoco o vías alternas por zonas urbanas para llegar a tiempo a sus destinos.

Autoridades estiman que el bloqueo podría mantenerse durante varias horas. Se otorgará tolerancia en el ingreso a clases para alumnos y docentes afectados.`,
    date: '2025-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1547638375-ebf04735d792?q=80&w=800&auto=format&fit=crop',
    category: 'Campus'
  },
  {
    id: 'ext-2',
    title: 'No hay paso en las vias del tren',
    summary: 'Mantenimiento urgente en el cruce ferroviario principal. Acceso restringido por 48 horas.',
    content: `Aviso Importante:

Debido a trabajos de mantenimiento urgente por parte de la empresa ferroviaria, el cruce de las vías del tren que da acceso a la zona norte del municipio permanecerá cerrado.

No habrá paso para vehículos ni peatones durante las próximas 48 horas. Se ha habilitado un desvío provisional a 500 metros.

Por favor, anticipe sus tiempos de traslado para evitar retrasos.`,
    date: '2025-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop',
    category: 'Campus'
  }
];

const MOCK_TEACHERS: Teacher[] = [
  // TIC'S
  {
    id: 'tic-1',
    name: 'ZARCO CARRILLO FRANCISCO JAVIER',
    department: 'FUNDAMENTOS DE REDES DE COMPUTADORAS',
    photoUrl: 'https://picsum.photos/seed/zarco/100',
    career: "Ingeniería en TIC'S",
    specialty: "Redes y Telecomunicaciones",
    studies: "Maestría en Redes de Datos"
  },
  {
    id: 'tic-2',
    name: 'SANDOVAL ARGAEZ BERENICE DAFNE',
    department: 'INGENIERÍA FINANCIERA',
    photoUrl: 'https://picsum.photos/seed/sandoval/100',
    career: "Ingeniería en TIC'S",
    specialty: "Finanzas y Economía",
    studies: "Doctorado en Finanzas"
  },
  {
    id: 'tic-3',
    name: 'MARTINEZ AVILA YADHEE',
    department: 'INVESTIGACIÓN DE OPERACIONES I',
    photoUrl: 'https://picsum.photos/seed/martinez/100',
    career: "Ingeniería en TIC'S",
    specialty: "Optimización Matemática",
    studies: "Maestría en Ciencias"
  },
  {
    id: 'tic-4',
    name: 'ARIAS PERALTA HUMBERTO',
    department: 'COMUNICACIÓN ANALÓGICA Y DIGITAL',
    photoUrl: 'https://picsum.photos/seed/arias/100',
    career: "Ingeniería en TIC'S",
    specialty: "Electrónica y Comunicaciones",
    studies: "Ingeniería en Electrónica"
  },
  {
    id: 'tic-5',
    name: 'COUTIÑO DIAZ EMILIO ALFONSO',
    department: 'TALLER DE INVESTIGACIÓN I',
    photoUrl: 'https://picsum.photos/seed/coutino/100',
    career: "Ingeniería en TIC'S",
    specialty: "Metodología de la Investigación",
    studies: "Doctorado en Educación"
  },
  {
    id: 'tic-6',
    name: 'ALTAMIRANO ORTEGA DALIA',
    department: 'INGLÉS V',
    photoUrl: 'https://picsum.photos/seed/altamirano/100',
    career: "Ingeniería en TIC'S",
    specialty: "Lenguas Extranjeras",
    studies: "Licenciatura en Enseñanza del Inglés"
  },
  {
    id: 'tic-7',
    name: 'HERNANDEZ LARA DERLIS',
    department: 'ANÁLISIS Y DISEÑO DE CIRCUITOS DIGITALES',
    photoUrl: 'https://picsum.photos/seed/hernandez/100',
    career: "Ingeniería en TIC'S",
    specialty: "Sistemas Digitales",
    studies: "Ingeniería Mecatrónica"
  },

  // INDUSTRIAL
  {
    id: 'ind-1',
    name: 'MARTINEZ AVILA YADHEE',
    department: 'ADMINISTRACIÓN DE PROYECTOS',
    photoUrl: 'https://picsum.photos/seed/martinez/100',
    career: "Ingeniería Industrial",
    specialty: "Gestión de Proyectos",
    studies: "MBA"
  },
  {
    id: 'ind-2',
    name: 'BADILLO FLORES ALEJANDRO',
    department: 'ADMINISTRACIÓN DE OPERACIONES II',
    photoUrl: 'https://picsum.photos/seed/badillo/100',
    career: "Ingeniería Industrial",
    specialty: "Logística y Cadena de Suministro",
    studies: "Maestría en Logística Internacional"
  },
  {
    id: 'ind-3',
    name: 'SANDOVAL ARGAEZ BERENICE DAFNE',
    department: 'INVESTIGACIÓN DE OPERACIONES I',
    photoUrl: 'https://picsum.photos/seed/sandoval/100',
    career: "Ingeniería Industrial",
    specialty: "Optimización de Procesos",
    studies: "Ingeniería Química Industrial"
  },
  {
    id: 'ind-4',
    name: 'MARTINEZ VAZQUEZ VICTOR ISMAEL',
    department: 'ADMINISTRACIÓN DEL MANTENIMIENTO',
    photoUrl: 'https://picsum.photos/seed/victor/100',
    career: "Ingeniería Industrial",
    specialty: "Mantenimiento Industrial",
    studies: "Ingeniería Mecánica"
  },
  {
    id: 'ind-5',
    name: 'ESPEJEL ALMERAYA ALDO',
    department: 'ESTADÍSTICA II',
    photoUrl: 'https://picsum.photos/seed/aldo/100',
    career: "Ingeniería Industrial",
    specialty: "Estadística Aplicada",
    studies: "Licenciatura en Matemáticas"
  },
  {
    id: 'ind-6',
    name: 'SANCHEZ MIRANDA SANDRA',
    department: 'ADMINISTRACIÓN DE LA CALIDAD',
    photoUrl: 'https://picsum.photos/seed/sandra/100',
    career: "Ingeniería Industrial",
    specialty: "Sistemas de Gestión de Calidad",
    studies: "Ingeniería Industrial"
  },
  {
    id: 'ind-7',
    name: 'ALTAMIRANO ORTEGA DALIA',
    department: 'INGLÉS V',
    photoUrl: 'https://picsum.photos/seed/altamirano/100',
    career: "Ingeniería Industrial",
    specialty: "Lenguas Extranjeras",
    studies: "Licenciatura en Lenguas Modernas"
  },

  // DERECHO
  {
    id: 'der-1',
    name: 'COUTIÑO DIAZ EMILIO ALFONSO',
    department: 'EXPRESIÓN ORAL Y ESCRITA',
    photoUrl: 'https://picsum.photos/seed/coutino/100',
    career: "Licenciatura en Derecho",
    specialty: "Oratoria Forense",
    studies: "Licenciatura en Derecho"
  },
  {
    id: 'der-2',
    name: 'RAMÍREZ ALAÑA JOSE LUIS',
    department: 'FUNDAMENTOS DEL DERECHO',
    photoUrl: 'https://picsum.photos/seed/joseluis/100',
    career: "Licenciatura en Derecho",
    specialty: "Teoría General del Derecho",
    studies: "Doctorado en Derecho"
  },
  {
    id: 'der-3',
    name: 'CEDEÑO DORANTES SUSANA',
    department: 'DERECHOS DE LA PERSONA',
    photoUrl: 'https://picsum.photos/seed/susana/100',
    career: "Licenciatura en Derecho",
    specialty: "Derecho Civil",
    studies: "Especialidad en Derecho Civil"
  },
  {
    id: 'der-4',
    name: 'RIVAS DE LA VEGA ERIKA',
    department: 'IDENTIDAD Y CULTURA',
    photoUrl: 'https://picsum.photos/seed/erika/100',
    career: "Licenciatura en Derecho",
    specialty: "Sociología Jurídica",
    studies: "Maestría en Derechos Humanos"
  },
  {
    id: 'der-5',
    name: 'VICTORIA RAMOS SANDRA IVARAKI',
    department: 'ACTIVIDADES DEPORTIVAS SOCIALES Y CULTURALES',
    photoUrl: 'https://picsum.photos/seed/victoria/100',
    career: "Licenciatura en Derecho",
    specialty: "Desarrollo Humano",
    studies: "Maestría en Educación"
  },
  {
    id: 'der-6',
    name: 'ALVAREZ PEREZ FATIMA ADRIANA',
    department: 'INSTITUCIONES DEL DERECHO ROMANO',
    photoUrl: 'https://picsum.photos/seed/fatima/100',
    career: "Licenciatura en Derecho",
    specialty: "Historia del Derecho",
    studies: "Maestría en Derecho Romano"
  },
  {
    id: 'der-7',
    name: 'ATLITEC GODINEZ OSCAR CRISTOPHE',
    department: 'TEORÍA DEL ESTADO',
    photoUrl: 'https://picsum.photos/seed/oscar/100',
    career: "Licenciatura en Derecho",
    specialty: "Derecho Constitucional",
    studies: "Doctorado en Derecho Público"
  },
  {
    id: 'der-8',
    name: 'RAMIREZ ALAÑA JOSE ALEJANDRO',
    department: 'FUNDAMENTOS DE DERECHOS HUMANOS',
    photoUrl: 'https://picsum.photos/seed/josealejandro/100',
    career: "Licenciatura en Derecho",
    specialty: "Derechos Humanos",
    studies: "Maestría en Derechos Humanos y Democracia"
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
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER_STUDENT' | 'REGISTER_TEACHER'>('LOGIN');
  
  // Login/Register Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration specific
  const [regName, setRegName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regMatricula, setRegMatricula] = useState(''); // For Teacher
  const [regCareer, setRegCareer] = useState<string>("Ingeniería en TIC'S");

  // Database of Users (stored in Admin Dashboard)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // --- APP STATE ---
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.NEWS);
  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [events, setEvents] = useState<UniversityEvent[]>(MOCK_EVENTS);
  
  // News State (Lifted for persistence and admin management)
  const [internalNews, setInternalNews] = useState<NewsItem[]>(MOCK_INTERNAL_NEWS);
  const [externalNews, setExternalNews] = useState<NewsItem[]>(MOCK_EXTERNAL_NEWS);

  // --- ENABLED SECTIONS STATE (ADMIN CONTROL) ---
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>({
    [ViewState.CALENDAR]: true,
    [ViewState.ATTENDANCE]: true,
    [ViewState.TEACHER_INFO]: true,
    [ViewState.TEACHER_EVALUATION]: true,
    [ViewState.ADVISORY]: true,
    [ViewState.LIBRARY]: true,
    [ViewState.CAFETERIA]: true,
    [ViewState.MAP]: true,
    [ViewState.CAREER_GUIDANCE]: true,
    [ViewState.GAMES]: true,
  });

  const handleToggleSection = (section: string) => {
    setEnabledSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
  const handleRegisterStudent = (e: React.FormEvent) => {
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
    setAuthMode('LOGIN');
    setLoginUsername(regUser);
    setLoginPassword('');
    alert('Registro de alumno exitoso. Por favor inicia sesión.');
  };

  const handleRegisterTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Use Matricula as username for teachers
    if (registeredUsers.some(u => u.username === regMatricula)) {
      setLoginError('Esta matrícula ya está registrada');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: regName,
      username: regMatricula, // Username is Matricula
      password: regPass,
      role: 'TEACHER'
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    setAuthMode('LOGIN');
    setLoginUsername(regMatricula);
    setLoginPassword('');
    alert('Registro de docente exitoso. Por favor inicia sesión con tu matrícula.');
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

      // 2. Check Teacher (Legacy UMB start)
      if (loginUsername.startsWith('UMB')) {
         const teacherUser: User = { id: 'teacher', username: loginUsername, name: 'Docente UMB', role: 'TEACHER' };
         setCurrentUser(teacherUser);
         setIsAuthenticated(true);
         setCurrentView(ViewState.NEWS);
         return;
      }

      // 3. Check Registered User (Student or Teacher)
      const user = registeredUsers.find(u => u.username === loginUsername && u.password === loginPassword);
      if (user) {
        setCurrentUser(user);
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

  // --- NEWS HANDLERS ---
  const handleAddNews = (item: NewsItem, type: 'INTERNAL' | 'EXTERNAL') => {
    if (type === 'INTERNAL') {
      setInternalNews([item, ...internalNews]);
    } else {
      setExternalNews([item, ...externalNews]);
    }
  };

  const handleDeleteNews = (id: string, type: 'INTERNAL' | 'EXTERNAL') => {
    if (type === 'INTERNAL') {
      setInternalNews(internalNews.filter(n => n.id !== id));
    } else {
      setExternalNews(externalNews.filter(n => n.id !== id));
    }
  };

  const handleUpdateNewsItem = (item: NewsItem, type: 'INTERNAL' | 'EXTERNAL') => {
    if (type === 'INTERNAL') {
      setInternalNews(internalNews.map(n => n.id === item.id ? item : n));
    } else {
      setExternalNews(externalNews.map(n => n.id === item.id ? item : n));
    }
  }

  // --- DATA HANDLERS ---
  const handleToggleAbsence = (teacherId: string, date: Date, reason?: string) => {
    // Only Admin can modify
    if (currentUser?.role !== 'ADMIN') return;

    setAbsences(prev => {
      // Precise check including time
      const exists = prev.find(a => a.teacherId === teacherId && a.date.getTime() === date.getTime());
      
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
          <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://floresarchundia.com/wp-content/uploads/2018/05/a7f8788e-5295-4d00-be0b-6c93259adb1b.jpg')" 
            }}
          >
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-[#41F73B] p-8 text-center">
                      <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <LogIn className="w-8 h-8 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-white">Bienvenido UMB Atenco</h1>
                      <p className="text-white/80 text-sm mt-2">Portal Universitario Digital</p>
                  </div>
                  
                  <div className="p-8">
                      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
                        <button 
                          className={`flex-1 py-2 text-sm font-bold whitespace-nowrap px-2 ${authMode === 'LOGIN' ? 'text-[#41F73B] border-b-2 border-[#41F73B]' : 'text-slate-400'}`}
                          onClick={() => setAuthMode('LOGIN')}
                        >
                          Iniciar Sesión
                        </button>
                        <button 
                          className={`flex-1 py-2 text-sm font-bold whitespace-nowrap px-2 ${authMode === 'REGISTER_STUDENT' ? 'text-[#41F73B] border-b-2 border-[#41F73B]' : 'text-slate-400'}`}
                          onClick={() => setAuthMode('REGISTER_STUDENT')}
                        >
                          Reg. Alumno
                        </button>
                        <button 
                          className={`flex-1 py-2 text-sm font-bold whitespace-nowrap px-2 ${authMode === 'REGISTER_TEACHER' ? 'text-[#41F73B] border-b-2 border-[#41F73B]' : 'text-slate-400'}`}
                          onClick={() => setAuthMode('REGISTER_TEACHER')}
                        >
                          Reg. Docente
                        </button>
                      </div>

                      {authMode === 'REGISTER_STUDENT' && (
                         <form onSubmit={handleRegisterStudent} className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Carrera</label>
                                <select value={regCareer} onChange={e => setRegCareer(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required>
                                    <option value="Ingeniería en TIC'S">Ingeniería en TIC'S</option>
                                    <option value="Ingeniería Industrial">Ingeniería en Industrial</option>
                                    <option value="Licenciatura en Derecho">Licenciatura en Derecho</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Usuario</label>
                                <input type="text" value={regUser} onChange={e => setRegUser(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
                                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required />
                            </div>
                            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
                            <button type="submit" className="w-full bg-[#41F73B] text-white font-bold py-3 rounded-xl hover:bg-green-500">Registrarse</button>
                         </form>
                      )}
                      
                      {authMode === 'REGISTER_TEACHER' && (
                         <form onSubmit={handleRegisterTeacher} className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Matrícula</label>
                                <input type="text" value={regMatricula} onChange={e => setRegMatricula(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required placeholder="Será tu usuario" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
                                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full px-3 py-2 border border-black bg-white rounded-xl focus:ring-[#41F73B] outline-none" required />
                            </div>
                            {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
                            <button type="submit" className="w-full bg-[#41F73B] text-white font-bold py-3 rounded-xl hover:bg-green-500">Registrar Docente</button>
                         </form>
                      )}

                      {authMode === 'LOGIN' && (
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
                                        className="w-full pl-10 pr-4 py-3 border border-black bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41F73B] transition-shadow"
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
                                        className="w-full pl-10 pr-4 py-3 border border-black bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41F73B] transition-shadow"
                                    />
                                </div>
                            </div>
                            {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}

                            <button 
                                type="submit"
                                className="w-full bg-[#41F73B] hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-4"
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
    const userCareer = currentUser?.role === 'STUDENT' ? currentUser.career : undefined;

    switch (currentView) {
      case ViewState.ADMIN_DASHBOARD:
        return <AdminDashboard 
            advisories={advisoryRegistrations}
            libraryReservations={libraryReservations}
            jobApplications={jobApplications}
            teacherRatings={teacherRatings}
            teachers={teachers}
            registeredUsers={registeredUsers} // Pass DB
            enabledSections={enabledSections}
            onToggleSection={handleToggleSection}
        />;
      case ViewState.NEWS:
        return <NewsSection 
            userRole={currentUser?.role} 
            internalNews={internalNews}
            externalNews={externalNews}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onUpdateNews={handleUpdateNewsItem}
        />;
      case ViewState.CALENDAR:
        return enabledSections[ViewState.CALENDAR] ? <CalendarSection 
          events={events} 
          absences={absences} 
          teachers={teachers} 
          onAddEvent={handleAddEvent} 
          userRole={currentUser?.role}
          userCareer={currentUser?.career}
        /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.ATTENDANCE:
        return enabledSections[ViewState.ATTENDANCE] ? <AttendanceTracker 
            teachers={teachers} 
            absences={absences} 
            onToggleAbsence={handleToggleAbsence} 
            readOnly={currentUser?.role !== 'ADMIN'} 
            userCareer={userCareer}
        /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.TEACHER_EVALUATION:
        return enabledSections[ViewState.TEACHER_EVALUATION] ? <TeacherEvaluation 
            teachers={teachers} 
            onSubmitEvaluation={handleRateTeacher} 
            userCareer={userCareer}
        /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.TEACHER_INFO:
        return enabledSections[ViewState.TEACHER_INFO] ? <TeacherInfoSection 
          teachers={teachers} 
          userCareer={userCareer}
        /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.ADVISORY:
        return enabledSections[ViewState.ADVISORY] ? <AdvisorySection 
          onRegister={handleRegisterAdvisory} 
          userCareer={userCareer}
          teacherName={currentUser?.role === 'TEACHER' ? currentUser.name : undefined}
          registrations={advisoryRegistrations}
        /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.LIBRARY:
        return enabledSections[ViewState.LIBRARY] ? <LibrarySection onReserve={handleReserveBook} /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.CAFETERIA:
        return enabledSections[ViewState.CAFETERIA] ? <CafeteriaSection /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.MAP:
        return enabledSections[ViewState.MAP] ? <CampusMap userRole={currentUser?.role} /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.CAREER_GUIDANCE:
        return enabledSections[ViewState.CAREER_GUIDANCE] ? <CareerGuidanceSection onSubmitJobSearch={handleJobApplication} /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      case ViewState.GAMES:
        return enabledSections[ViewState.GAMES] ? <GamesSection /> : <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
      default:
        return <NewsSection userRole={currentUser?.role} internalNews={internalNews} externalNews={externalNews} onAddNews={handleAddNews} onDeleteNews={handleDeleteNews} onUpdateNews={handleUpdateNewsItem} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isAdmin={currentUser?.role === 'ADMIN'}
        onLogout={handleLogout}
        enabledSections={enabledSections}
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
            className="bg-[#41F73B] hover:bg-green-500 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
          >
            <Bot className="w-6 h-6" />
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col" style={{maxHeight: '500px'}}>
            <div className="bg-[#41F73B] p-4 text-white flex justify-between items-center">
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
                  <p className="font-semibold text-green-600 mb-1">AI:</p>
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
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
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
                className="flex-grow text-sm border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#41F73B] bg-white"
              />
              <button 
                type="submit" 
                disabled={isChatLoading || !chatQuery.trim()}
                className="bg-[#41F73B] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-500 disabled:opacity-50"
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