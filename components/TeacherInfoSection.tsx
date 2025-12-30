import React, { useState } from 'react';
import { Teacher } from '../types';
import { X, GraduationCap, Award, BookOpen, Search, User } from 'lucide-react';

interface TeacherInfoSectionProps {
  teachers: Teacher[];
  userCareer?: string;
}

export const TeacherInfoSection: React.FC<TeacherInfoSectionProps> = ({ teachers, userCareer }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Group teachers by career for better organization
  const filteredTeachers = teachers.filter(t => {
      // 1. Search text filter
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Career filter (Strict for students)
      const matchesCareer = !userCareer || t.career === userCareer;

      return matchesSearch && matchesCareer;
  });

  const groupedTeachers = {
    "Ingeniería en TIC'S": filteredTeachers.filter(t => t.career === "Ingeniería en TIC'S"),
    "Ingeniería Industrial": filteredTeachers.filter(t => t.career === "Ingeniería Industrial"),
    "Licenciatura en Derecho": filteredTeachers.filter(t => t.career === "Licenciatura en Derecho"),
    "Otros": filteredTeachers.filter(t => !t.career)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center">
          <User className="w-10 h-10 mr-4 text-[#41F73B]" />
          Información Docente
        </h2>
        <p className="text-slate-500 mt-3 text-lg">Conoce la trayectoria y especialidad de tus profesores.</p>
        {userCareer && (
             <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                  Mostrando docentes de: {userCareer}
             </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar profesor por nombre o materia..." 
          className="w-full pl-12 pr-4 py-3 border border-black rounded-full focus:outline-none focus:ring-2 focus:ring-[#41F73B] shadow-sm bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Teachers Grid Grouped by Career */}
      {Object.entries(groupedTeachers).map(([career, careerTeachers]) => {
         if (careerTeachers.length === 0) return null;
         
         return (
            <div key={career} className="mb-12">
               <h3 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-[#41F73B] pl-4">{career}</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {careerTeachers.map(teacher => (
                    <div 
                        key={teacher.id} 
                        onClick={() => setSelectedTeacher(teacher)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-100 p-6 flex flex-col items-center cursor-pointer transition-all hover:-translate-y-1 group"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-slate-50 group-hover:border-[#41F73B] transition-colors">
                            <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-center mb-1 line-clamp-2 min-h-[3rem]">{teacher.name}</h4>
                        <p className="text-xs text-slate-500 text-center uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-full w-full truncate">
                            {teacher.department}
                        </p>
                        <button className="mt-4 text-xs font-bold text-[#41F73B] hover:text-green-700 flex items-center">
                            Ver Perfil <ArrowRightIcon className="w-3 h-3 ml-1" />
                        </button>
                    </div>
                ))}
               </div>
            </div>
         );
      })}

      {filteredTeachers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
              No se encontraron profesores que coincidan con tu búsqueda.
          </div>
      )}

      {/* Modal Details */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-up">
            <button 
                onClick={() => setSelectedTeacher(null)} 
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 z-10 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Header with Photo */}
            <div className="bg-gradient-to-r from-[#41F73B] to-green-600 p-8 pt-12 text-center relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto mb-4 overflow-hidden bg-white">
                    <img src={selectedTeacher.photoUrl} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{selectedTeacher.name}</h3>
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                    {selectedTeacher.department}
                </span>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
                <div>
                    <h4 className="flex items-center font-bold text-slate-800 mb-2 uppercase text-sm tracking-wider">
                        <Award className="w-5 h-5 mr-2 text-[#41F73B]" />
                        Especialidad
                    </h4>
                    <p className="text-slate-600 bg-green-50 p-3 rounded-lg border border-green-100">
                        {selectedTeacher.specialty || "Información no disponible."}
                    </p>
                </div>

                <div>
                    <h4 className="flex items-center font-bold text-slate-800 mb-2 uppercase text-sm tracking-wider">
                        <GraduationCap className="w-5 h-5 mr-2 text-[#41F73B]" />
                        Estudios / Carrera
                    </h4>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedTeacher.studies || "Información no disponible."}
                    </p>
                </div>

                <div>
                    <h4 className="flex items-center font-bold text-slate-800 mb-2 uppercase text-sm tracking-wider">
                        <BookOpen className="w-5 h-5 mr-2 text-[#41F73B]" />
                        Materia Impartida
                    </h4>
                    <p className="text-slate-600">
                        {selectedTeacher.department}
                    </p>
                </div>
            </div>
            
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                <button 
                    onClick={() => setSelectedTeacher(null)}
                    className="text-slate-500 hover:text-slate-800 font-medium text-sm"
                >
                    Cerrar Ventana
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon
const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);