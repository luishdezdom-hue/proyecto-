import React, { useState } from 'react';
import { BookOpen, Users, Clock, CalendarCheck, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';

const CAREERS = ["Ingeniería en TIC'S", "Ingeniería Industrial", "Licenciatura en Derecho"];

const ADVISORIES: Record<string, { subject: string; tutor: string; time: string; room: string }[]> = {
  "Ingeniería en TIC'S": [
    { subject: "Programación Orientada a Objetos", tutor: "Ing. Francisco Zarco", time: "Lun/Mié 14:00 - 16:00", room: "Sala de Cómputo 1" },
    { subject: "Redes de Computadoras", tutor: "Ing. Humberto Arias", time: "Mar/Jue 10:00 - 12:00", room: "Laboratorio Cisco" },
    { subject: "Estructura de Datos", tutor: "Ing. Berenice Sandoval", time: "Vie 09:00 - 11:00", room: "Aula B-102" },
    { subject: "Matemáticas Discretas", tutor: "Ing. Emilio Coutiño", time: "Jue 12:00 - 14:00", room: "Aula B-105" }
  ],
  "Ingeniería Industrial": [
    { subject: "Investigación de Operaciones", tutor: "Ing. Yadhee Martinez", time: "Lun/Mié 12:00 - 14:00", room: "Aula B-201" },
    { subject: "Estudio del Trabajo", tutor: "Ing. Emilio Coutiño", time: "Mar 16:00 - 18:00", room: "Taller Industrial" },
    { subject: "Logística y Cadena de Suministro", tutor: "Ing. Derlis Hernandez", time: "Jue 11:00 - 13:00", room: "Aula B-203" },
    { subject: "Control de Calidad", tutor: "Ing. Dalia Altamirano", time: "Vie 10:00 - 12:00", room: "Laboratorio de Calidad" }
  ],
  "Licenciatura en Derecho": [
    { subject: "Teoría General del Proceso", tutor: "Lic. Juan Pérez", time: "Lun 08:00 - 10:00", room: "Sala de Juicios Orales" },
    { subject: "Derecho Penal", tutor: "Lic. Maria Lopez", time: "Mié 10:00 - 12:00", room: "Aula B-301" },
    { subject: "Derecho Constitucional", tutor: "Lic. Pedro Sanchez", time: "Vie 14:00 - 16:00", room: "Aula B-302" },
    { subject: "Derecho Laboral", tutor: "Lic. Ana Torres", time: "Mar 09:00 - 11:00", room: "Aula B-304" }
  ]
};

export const AdvisorySection: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<string>("Ingeniería en TIC'S");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const handleRequest = (subject: string) => {
    setRequestStatus(`Solicitud enviada para ${subject}`);
    setTimeout(() => setRequestStatus(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {requestStatus && (
            <div className="fixed top-24 right-4 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center animate-fade-in-down">
            <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
            <span className="font-bold">{requestStatus}</span>
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
            onClick={() => setSelectedCareer(career)}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${
              selectedCareer === career
                ? 'bg-[#FF8FE9] text-white shadow-lg ring-2 ring-[#ff76e5] ring-offset-2'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
                            onClick={() => handleRequest(item.subject)}
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