import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, CalendarCheck, Brain, ArrowRight, CheckCircle2, X, User, Hash, GraduationCap } from 'lucide-react';
import { AdvisoryRegistration } from '../types';

const CAREERS = ["Ingeniería en TIC'S", "Ingeniería Industrial", "Licenciatura en Derecho"];

const ADVISORIES: Record<string, { subject: string; tutor: string; time: string; room: string }[]> = {
  "Ingeniería en TIC'S": [
    { subject: "Fundamentos de Redes de Computadoras", tutor: "Zarco Carrillo Francisco Javier", time: "Lun/Mié 14:00 - 16:00", room: "Sala de Cómputo 1" },
    { subject: "Comunicación Analógica y Digital", tutor: "Arias Peralta Humberto", time: "Mar/Jue 10:00 - 12:00", room: "Laboratorio Cisco" },
    { subject: "Análisis y Diseño de Circuitos Digitales", tutor: "Hernandez Lara Derlis", time: "Vie 09:00 - 11:00", room: "Aula B-102" },
    { subject: "Programación Web", tutor: "Jimenez Garcia Roberto", time: "Jue 12:00 - 14:00", room: "Aula B-105" },
    { subject: "Administración de Bases de Datos", tutor: "Perez Lopez Ana Maria", time: "Lun 16:00 - 18:00", room: "Lab de Bases de Datos" },
    { subject: "Ingeniería de Software", tutor: "Ramirez Torres Luis", time: "Mié 10:00 - 12:00", room: "Aula B-103" },
    { subject: "Sistemas Operativos", tutor: "Sanchez Gomez Karla", time: "Vie 12:00 - 14:00", room: "Lab Linux" }
  ],
  "Ingeniería Industrial": [
    { subject: "Administración de Proyectos", tutor: "Martinez Avila Yadhee", time: "Lun/Mié 12:00 - 14:00", room: "Aula B-201" },
    { subject: "Administración de Operaciones II", tutor: "Badillo Flores Alejandro", time: "Mar 16:00 - 18:00", room: "Taller Industrial" },
    { subject: "Investigación de Operaciones I", tutor: "Sandoval Argaez Berenice Dafne", time: "Jue 11:00 - 13:00", room: "Aula B-203" },
    { subject: "Administración del Mantenimiento", tutor: "Martinez Vazquez Victor Ismael", time: "Vie 10:00 - 12:00", room: "Laboratorio de Calidad" },
    { subject: "Estadística II", tutor: "Espejel Almeraya Aldo", time: "Mié 09:00 - 11:00", room: "Aula B-204" },
    { subject: "Administración de la Calidad", tutor: "Sanchez Miranda Sandra", time: "Lun 10:00 - 12:00", room: "Aula B-202" },
    { subject: "Inglés V", tutor: "Altamirano Ortega Dalia", time: "Jue 14:00 - 16:00", room: "Aula de Idiomas" }
  ],
  "Licenciatura en Derecho": [
    { subject: "Expresión Oral y Escrita", tutor: "Coutiño Diaz Emilio Alfonso", time: "Lun 08:00 - 10:00", room: "Sala de Juicios Orales" },
    { subject: "Fundamentos del Derecho", tutor: "Ramírez Alaña Jose Luis", time: "Mié 10:00 - 12:00", room: "Aula B-301" },
    { subject: "Derechos de la Persona", tutor: "Cedeño Dorantes Susana", time: "Vie 14:00 - 16:00", room: "Aula B-302" },
    { subject: "Identidad y Cultura", tutor: "Rivas de la Vega Erika", time: "Mar 09:00 - 11:00", room: "Aula B-304" },
    { subject: "Actividades Deportivas Soc. y Cult.", tutor: "Victoria Ramos Sandra Ivaraki", time: "Jue 16:00 - 18:00", room: "Canchas" },
    { subject: "Instituciones del Derecho Romano", tutor: "Alvarez Perez Fatima Adriana", time: "Vie 08:00 - 10:00", room: "Aula B-303" },
    { subject: "Teoría del Estado", tutor: "Atlitec Godinez Oscar Cristophe", time: "Lun 12:00 - 14:00", room: "Aula B-305" },
    { subject: "Fundamentos de Derechos Humanos", tutor: "Ramirez Alaña Jose Alejandro", time: "Mié 16:00 - 18:00", room: "Aula B-306" }
  ]
};

interface AdvisorySectionProps {
    onRegister?: (data: Omit<AdvisoryRegistration, 'id' | 'timestamp'>) => void;
    userCareer?: string;
}

export const AdvisorySection: React.FC<AdvisorySectionProps> = ({ onRegister, userCareer }) => {
  const [selectedCareer, setSelectedCareer] = useState<string>(userCareer || "Ingeniería en TIC'S");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  // Sync prop change
  useEffect(() => {
    if (userCareer) setSelectedCareer(userCareer);
  }, [userCareer]);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<{ subject: string; tutor: string } | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    group: '',
    matricula: '',
    selectedTime: ''
  });

  const generateRandomSlots = () => {
    const slots: string[] = [];
    const usedHours = new Set<number>();
    
    // Generate 3 unique slots between 7am (7) and 7pm (19)
    while (slots.length < 3) {
      // Random hour between 7 and 18 (so the slot ends at 19 max)
      const startHour = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
      
      if (!usedHours.has(startHour)) {
        usedHours.add(startHour);
        // Format: "08:00 - 09:00"
        const endHour = startHour + 1;
        const startStr = startHour.toString().padStart(2, '0') + ':00';
        const endStr = endHour.toString().padStart(2, '0') + ':00';
        slots.push(`${startStr} - ${endStr}`);
      }
    }
    // Sort times chronologically
    return slots.sort();
  };

  const handleOpenModal = (item: { subject: string; tutor: string }) => {
    setSelectedSubject(item);
    setAvailableTimes(generateRandomSlots());
    setFormData({ fullName: '', group: '', matricula: '', selectedTime: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRegister && selectedSubject) {
        onRegister({
            studentName: formData.fullName,
            matricula: formData.matricula,
            group: formData.group,
            subject: selectedSubject.subject,
            tutor: selectedSubject.tutor,
            time: formData.selectedTime
        });
    }

    setIsModalOpen(false);
    setRequestStatus(`Solicitud enviada exitosamente para ${selectedSubject?.subject} a las ${formData.selectedTime}`);
    setTimeout(() => setRequestStatus(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {requestStatus && (
            <div className="fixed top-24 right-4 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center animate-fade-in-down">
            <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
            <span className="font-bold">{requestStatus}</span>
            </div>
        )}

      {/* Registration Modal */}
      {isModalOpen && selectedSubject && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-[#FF8FE9] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Inscripción a Asesoría
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="mb-2">
                <h4 className="text-xl font-bold text-slate-800">{selectedSubject.subject}</h4>
                <p className="text-sm text-slate-500">Tutor: {selectedSubject.tutor}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-1 text-slate-400" /> Nombre Completo
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF8FE9] focus:outline-none text-sm"
                    placeholder="Ej. María González López"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-1 text-slate-400" /> Grupo
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.group}
                      onChange={e => setFormData({...formData, group: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF8FE9] focus:outline-none text-sm"
                      placeholder="Ej. 1801"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <Hash className="w-4 h-4 mr-1 text-slate-400" /> Matrícula
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.matricula}
                      onChange={e => setFormData({...formData, matricula: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#FF8FE9] focus:outline-none text-sm"
                      placeholder="Ej. 20210045"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-slate-400" /> Selecciona un Horario
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({...formData, selectedTime: time})}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left flex justify-between items-center
                          ${formData.selectedTime === time 
                            ? 'border-[#FF8FE9] bg-pink-50 text-[#d147a3] ring-1 ring-[#FF8FE9]' 
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }
                        `}
                      >
                        <span>{time}</span>
                        {formData.selectedTime === time && <CheckCircle2 className="w-4 h-4 text-[#FF8FE9]" />}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">Duración de la sesión: 1 hora</p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={!formData.fullName || !formData.group || !formData.matricula || !formData.selectedTime}
                  className="flex-1 py-2.5 bg-[#FF8FE9] text-white rounded-xl font-bold shadow-md hover:bg-[#ff76e5] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center">
          <Brain className="w-10 h-10 mr-4 text-[#FF8FE9]" />
          Asesorías Académicas
        </h2>
        <p className="text-slate-500 mt-3 text-lg">Refuerza tus conocimientos con tutorías especializadas.</p>
      </div>

      {/* Career Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {CAREERS.map(career => (
          <button
            key={career}
            onClick={() => !userCareer && setSelectedCareer(career)}
            disabled={!!userCareer && userCareer !== career}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${
              selectedCareer === career
                ? 'bg-[#FF8FE9] text-white shadow-lg ring-2 ring-[#ff76e5] ring-offset-2'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100'
            }`}
          >
            {career}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-[#FF8FE9]" />
                Materias Disponibles - {selectedCareer}
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {ADVISORIES[selectedCareer].map((item, index) => (
                <div key={index} className="p-6 hover:bg-pink-50/30 transition-colors group border-b border-slate-100 md:border-b-0 last:border-b-0">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {item.room}
                        </div>
                        <button 
                            onClick={() => handleOpenModal(item)}
                            className="text-sm font-semibold text-[#FF8FE9] hover:text-[#d147a3] flex items-center bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
                        >
                            Inscribirse <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    
                    <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#FF8FE9] transition-colors">{item.subject}</h4>
                    
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center text-slate-600 text-sm">
                            <Users className="w-4 h-4 mr-3 text-slate-400" />
                            <span className="font-medium">Tutor: {item.tutor}</span>
                        </div>
                        <div className="flex items-center text-slate-600 text-sm">
                            <Clock className="w-4 h-4 mr-3 text-slate-400" />
                            <span>{item.time}</span>
                        </div>
                        <div className="flex items-center text-slate-600 text-sm">
                            <CalendarCheck className="w-4 h-4 mr-3 text-slate-400" />
                            <span>Cupo limitado a 10 alumnos</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500">¿No encuentras la materia que buscas? <a href="#" className="text-[#FF8FE9] font-bold hover:underline">Solicita una asesoría especial aquí</a>.</p>
        </div>
      </div>
    </div>
  );
};