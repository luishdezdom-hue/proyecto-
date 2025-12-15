import React, { useState } from 'react';
import { Teacher, AbsenceRecord } from '../types';
import { Search, Lock } from 'lucide-react';

interface AttendanceTrackerProps {
  teachers: Teacher[];
  absences: AbsenceRecord[];
  onToggleAbsence: (teacherId: string, date: Date, reason?: string) => void;
  readOnly?: boolean;
  userCareer?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 to 18 (7am to 6pm)

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ teachers, absences, onToggleAbsence, readOnly = false, userCareer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date();

  // Filter by user career if present, then by search term
  const filteredTeachers = teachers.filter(t => {
    const matchesCareer = !userCareer || t.career === userCareer;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCareer && matchesSearch;
  });

  const isAbsentAtHour = (teacherId: string, hour: number) => {
    return absences.some(a => {
      const recordDate = new Date(a.date);
      return a.teacherId === teacherId && 
             recordDate.getDate() === today.getDate() &&
             recordDate.getMonth() === today.getMonth() &&
             recordDate.getFullYear() === today.getFullYear() &&
             recordDate.getHours() === hour;
    });
  };

  const handleHourClick = (teacherId: string, hour: number) => {
    if (readOnly) return;
    const date = new Date(today);
    date.setHours(hour, 0, 0, 0);
    // Passing "Ausente" as reason if we are marking it (though toggle logic handles removal)
    onToggleAbsence(teacherId, date, "Ausente"); 
  };

  // Group teachers by career
  const groupedTeachers = {
    "Ingeniería en TIC'S": filteredTeachers.filter(t => t.career === "Ingeniería en TIC'S"),
    "Ingeniería Industrial": filteredTeachers.filter(t => t.career === "Ingeniería Industrial"),
    "Licenciatura en Derecho": filteredTeachers.filter(t => t.career === "Licenciatura en Derecho"),
    "Otros": filteredTeachers.filter(t => !t.career)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Control de Asistencia Docente</h2>
          <p className="text-slate-500 mt-1">Marcar inasistencias por hora para hoy: <span className="font-semibold text-green-600">{today.toLocaleDateString()}</span></p>
          {userCareer && (
             <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                  Mostrando docentes de: {userCareer}
             </span>
          )}
          {readOnly && (
            <p className="text-xs text-orange-600 font-bold mt-1 flex items-center">
               <Lock className="w-3 h-3 mr-1" /> Vista de Alumno (Solo lectura)
            </p>
          )}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar profesor..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41F73B]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {Object.entries(groupedTeachers).map(([career, careerTeachers]) => {
        if (careerTeachers.length === 0) return null;

        return (
          <div key={career} className="mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">{career}</h3>
            <div className="grid grid-cols-1 gap-6">
              {careerTeachers.map(teacher => {
                return (
                  <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-1/3">
                      <img src={teacher.photoUrl} alt={teacher.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-1" title={teacher.name}>{teacher.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{teacher.department}</p>
                      </div>
                    </div>

                    <div className="flex-1 flex justify-between md:justify-end gap-1 overflow-x-auto pb-2 md:pb-0">
                        {HOURS.map(hour => {
                            const isAbsent = isAbsentAtHour(teacher.id, hour);
                            return (
                                <button
                                    key={hour}
                                    onClick={() => handleHourClick(teacher.id, hour)}
                                    disabled={readOnly}
                                    title={`${hour}:00 - ${isAbsent ? 'Ausente' : 'Presente'}`}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex flex-col items-center justify-center text-[10px] font-bold transition-all border
                                        ${isAbsent 
                                            ? 'bg-red-500 text-white border-red-600 shadow-inner' 
                                            : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                        }
                                        ${readOnly ? 'cursor-default opacity-90' : 'cursor-pointer active:scale-95'}
                                    `}
                                >
                                    <span>{hour}</span>
                                    <span className="text-[8px] opacity-70">{isAbsent ? 'F' : 'A'}</span>
                                </button>
                            );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          No se encontraron profesores.
        </div>
      )}
    </div>
  );
};