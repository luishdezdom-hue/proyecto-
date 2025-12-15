import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NewsSection } from './components/NewsSection';
import { CalendarSection } from './components/CalendarSection';
import { AttendanceTracker } from './components/AttendanceTracker';
import { TeacherEvaluation } from './components/TeacherEvaluation';
import { Tournaments } from './components/Tournaments';
import { ViewState, Teacher, AbsenceRecord, UniversityEvent, EventType } from './types';
import { generateUniversityInsights } from './services/geminiService';
import { Bot, X } from 'lucide-react';

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
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.NEWS);
  const [teachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [absences, setAbsences] = useState<AbsenceRecord[]>([]);
  const [events, setEvents] = useState<UniversityEvent[]>(MOCK_EVENTS);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleToggleAbsence = (teacherId: string, date: Date, reason?: string) => {
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

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    
    setIsChatLoading(true);
    setChatResponse(null);
    const answer = await generateUniversityInsights(chatQuery);
    setChatResponse(answer);
    setIsChatLoading(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.NEWS:
        return <NewsSection />;
      case ViewState.CALENDAR:
        return <CalendarSection events={events} absences={absences} teachers={teachers} onAddEvent={handleAddEvent} />;
      case ViewState.ATTENDANCE:
        return <AttendanceTracker teachers={teachers} absences={absences} onToggleAbsence={handleToggleAbsence} />;
      case ViewState.TEACHER_EVALUATION:
        return <TeacherEvaluation teachers={teachers} />;
      case ViewState.TOURNAMENTS:
        return <Tournaments />;
      default:
        return <NewsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
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