import React, { useState } from 'react';
import { Teacher, TeacherRating } from '../types';
import { Star, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

interface TeacherEvaluationProps {
  teachers: Teacher[];
  onSubmitEvaluation?: (data: TeacherRating) => void;
  userCareer?: string;
}

const QUESTIONS = [
  "1. Dominio del tema impartido",
  "2. Puntualidad y asistencia a clase",
  "3. Claridad en la explicación de temas",
  "4. Respeto y trato digno hacia los alumnos",
  "5. Uso adecuado de material didáctico",
  "6. Sistema de evaluación claro y justo",
  "7. Calidad de retroalimentación en tareas",
  "8. Fomento a la participación en clase",
  "9. Actualización de los contenidos",
  "10. Disposición para resolver dudas",
  "11. Cumplimiento del temario oficial",
  "12. Motivación e interés por la materia",
  "13. Organización y estructura de la clase",
  "14. Equidad en el trato a estudiantes",
  "15. Satisfacción general con el docente"
];

export const TeacherEvaluation: React.FC<TeacherEvaluationProps> = ({ teachers, onSubmitEvaluation, userCareer }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Filter teachers by career if userCareer is provided
  const visibleTeachers = userCareer 
    ? teachers.filter(t => t.career === userCareer)
    : teachers;

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  const handleRating = (questionIndex: number, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [questionIndex]: rating
    }));
  };

  const handleSubmit = () => {
    if (onSubmitEvaluation && selectedTeacherId) {
        onSubmitEvaluation({
            teacherId: selectedTeacherId,
            ratings: ratings
        });
    }
    
    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setRatings({});
      setSelectedTeacherId('');
    }, 3000);
  };

  // Calculate progress
  const answeredCount = Object.keys(ratings).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">¡Evaluación Enviada!</h2>
          <p className="text-slate-600">Gracias por tu retroalimentación. Tu opinión nos ayuda a mejorar la calidad educativa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Calificación de Docentes</h2>
        <p className="text-slate-500 mt-2">Evalúa el desempeño de tus profesores. Tu opinión es anónima e importante.</p>
        {userCareer && (
             <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                  Mostrando docentes de: {userCareer}
             </span>
        )}
      </div>

      {/* Teacher Selection List - Hidden if teacher is selected */}
      {!selectedTeacher && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 animate-fade-in">
          <label className="block text-sm font-medium text-slate-700 mb-3">Selecciona un docente a evaluar:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleTeachers.map(teacher => (
              <button
                key={teacher.id}
                onClick={() => {
                  setSelectedTeacherId(teacher.id);
                  setRatings({}); // Reset ratings on change
                }}
                className={`flex items-center p-3 rounded-lg border transition-all duration-200 text-left border-slate-200 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 group`}
              >
                <img src={teacher.photoUrl} alt={teacher.name} className="w-10 h-10 rounded-full object-cover mr-3 group-hover:ring-2 group-hover:ring-[#41F73B]" />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{teacher.name}</p>
                  <p className="text-xs text-slate-500 truncate">{teacher.department}</p>
                </div>
              </button>
            ))}
          </div>
          {visibleTeachers.length === 0 && (
              <p className="text-slate-400 text-sm italic">No se encontraron docentes para tu carrera.</p>
          )}
        </div>
      )}

      {/* Survey Form - Shown only when teacher selected */}
      {selectedTeacher && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-slide-up">
          <div className="bg-[#41F73B]/10 p-6 border-b border-green-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedTeacherId('')}
                className="mr-4 p-2 rounded-full hover:bg-white/50 text-slate-600 transition-colors"
                title="Volver a la lista"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <img src={selectedTeacher.photoUrl} alt={selectedTeacher.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm mr-4" />
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedTeacher.name}</h3>
                <p className="text-slate-600 text-sm">{selectedTeacher.department}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-500 mb-1">Progreso</div>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#41F73B] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-1">{answeredCount} de {QUESTIONS.length}</div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {QUESTIONS.map((question, index) => (
              <div key={index} className="border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                <p className="text-slate-800 font-medium mb-3 text-base">{question}</p>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-xs text-slate-400 font-medium">Deficiente</span>
                  <div className="flex space-x-1 sm:space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(index, star)}
                        className={`p-1 rounded-full transition-transform hover:scale-110 focus:outline-none`}
                      >
                        <Star 
                          className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-200 
                            ${(ratings[index] || 0) >= star 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-slate-200 hover:text-yellow-200'
                            }
                          `} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Excelente</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={answeredCount < QUESTIONS.length}
              className={`flex items-center px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all
                ${answeredCount < QUESTIONS.length 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-[#41F73B] hover:bg-green-500 hover:shadow-xl hover:-translate-y-0.5'
                }
              `}
            >
              <Send className="w-5 h-5 mr-2" />
              Enviar Evaluación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};