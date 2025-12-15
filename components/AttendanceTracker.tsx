import React, { useState } from 'react';
import { Teacher, AbsenceRecord } from '../types';
import { Search, UserMinus, CheckCircle } from 'lucide-react';

interface AttendanceTrackerProps {
  teachers: Teacher[];
  absences: AbsenceRecord[];
  onToggleAbsence: (teacherId: string, date: Date, reason?: string) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ teachers, absences, onToggleAbsence }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date();

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAbsentToday = (teacherId: string) => {
    return absences.some(a => 
      a.teacherId === teacherId && 
      new Date(a.date).toDateString() === today.toDateString()
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Control de Asistencia Docente</h2>
          <p className="text-slate-500 mt-1">Marcar inasistencias para hoy: <span className="font-semibold text-[#d147a3]">{today.toLocaleDateString()}</span></p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar profesor..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8FE9]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => {
          const absent = isAbsentToday(teacher.id);
          
          return (
            <div key={teacher.id} className={`bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between transition-all duration-200
              ${absent ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}
            `}>
              <div className="flex items-center space-x-4">
                <img src={teacher.photoUrl} alt={teacher.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">{teacher.name}</h3>
                  <p className="text-xs text-slate-500">{teacher.department}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleAbsence(teacher.id, today, absent ? undefined : "Asuntos personales")}
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${absent 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200 focus:ring-green-500'
                  }
                `}
                title={absent ? "Marcar Presente" : "Marcar Ausente"}
              >
                {absent ? <UserMinus className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              </button>
            </div>
          );
        })}
      </div>
      
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No se encontraron profesores.
        </div>
      )}
    </div>
  );
};