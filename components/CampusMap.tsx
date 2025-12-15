import React from 'react';
import { MapPin, Building, Activity, BookOpen, GraduationCap, Microscope, Presentation, HeartPulse, Printer, Gavel, Monitor, Cog } from 'lucide-react';

const LOCATIONS = [
  { id: 1, name: 'Edificio A - Gobierno', icon: Building, desc: 'Rectoría, Servicios Escolares y Caja.', color: 'bg-blue-500' },
  { id: 2, name: 'Edificio B - Aulas', icon: GraduationCap, desc: 'Salones 101-120, Sala de Maestros.', color: 'bg-green-500' },
  { id: 3, name: 'Edificio C - Laboratorios', icon: Microscope, desc: 'Labs de Cómputo, Química y Física.', color: 'bg-purple-500' },
  { id: 4, name: 'Biblioteca Central', icon: BookOpen, desc: 'Acervo, Cubículos de estudio.', color: 'bg-orange-500' },
  { id: 5, name: 'Canchas Deportivas', icon: Activity, desc: 'Fútbol, Básquetbol y Gimnasio.', color: 'bg-red-500' },
  { id: 6, name: 'Cafetería', icon: MapPin, desc: 'Área de comida y esparcimiento.', color: 'bg-pink-500' },
  { id: 7, name: 'Auditorio', icon: Presentation, desc: 'Conferencias y eventos culturales.', color: 'bg-indigo-500' },
  { id: 8, name: 'Enfermería', icon: HeartPulse, desc: 'Atención primeros auxilios.', color: 'bg-rose-500' },
  { id: 9, name: 'Papelería', icon: Printer, desc: 'Impresiones y material escolar.', color: 'bg-yellow-600' },
  { id: 10, name: 'Sala de Juicios Orales', icon: Gavel, desc: 'Prácticas de Licenciatura en Derecho.', color: 'bg-stone-500' },
  { id: 11, name: 'Centro de Cómputo', icon: Monitor, desc: 'Equipos especializados para Ingeniería.', color: 'bg-cyan-600' },
  { id: 12, name: 'Taller de Industrial', icon: Cog, desc: 'Maquinaria y procesos de manufactura.', color: 'bg-slate-600' },
];

export const CampusMap: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Mapa del Campus</h2>
        <p className="text-slate-500 mt-2">Ubica fácilmente todos los espacios de la UES Atenco.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Visual Map Representation (Abstract) */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 p-8 relative min-h-[500px] shadow-inner overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* 
                Grid Layout: 5 columns
                Col 1: Cafeteria (Full Height)
                Col 2: Edificio B
                Col 3: Explanada
                Col 4: Edificio A
                Col 5: Canchas
                Row Bottom: Estacionamiento
            */}
            <div className="grid grid-cols-5 grid-rows-4 gap-4 h-full relative z-10 min-h-[450px]">
                
                {/* Leftmost Column - Cafeteria (Full Height) */}
                <div className="col-span-1 row-span-4 bg-pink-100 border-2 border-pink-400 border-r-4 border-r-pink-300/50 border-dashed rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-pink-800 shadow-sm flex-col relative">
                    <div className="absolute right-[-18px] top-0 bottom-0 w-1 border-r-2 border-slate-300 border-dashed h-full"></div>
                    <MapPin className="w-6 h-6 mb-2 opacity-50" />
                    Cafetería
                    <span className="text-[10px] font-normal opacity-75 mt-1">Comedor</span>
                </div>

                {/* Col 2 - Edificio B + Biblioteca */}
                <div className="col-span-1 row-span-3 col-start-2 bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-green-800 shadow-sm flex-col">
                    <GraduationCap className="w-6 h-6 mb-1 opacity-50" />
                    Edificio B
                    <span className="text-[10px] font-normal opacity-75 mb-2">Aulas</span>
                    
                    <div className="bg-orange-100 border border-orange-300 rounded px-2 py-1 mt-2 w-full">
                      <BookOpen className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                      <span className="text-[9px] text-orange-800 block leading-tight">Biblioteca Central</span>
                    </div>
                </div>

                {/* Col 3 - Explanada */}
                <div className="col-span-1 row-span-3 col-start-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-yellow-800 shadow-sm border-dashed">
                    Explanada
                </div>

                {/* Col 4 - Edificio A (Same size as B) */}
                <div className="col-span-1 row-span-3 col-start-4 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-blue-800 shadow-sm flex-col">
                    <Building className="w-6 h-6 mb-2 opacity-50" />
                    Edificio A
                    <span className="text-[10px] font-normal opacity-75">Gobierno</span>
                </div>

                {/* Col 5 - Canchas */}
                <div className="col-span-1 row-span-3 col-start-5 bg-red-100 border-2 border-red-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-red-800 shadow-sm flex-col">
                    <Activity className="w-5 h-5 mb-1 opacity-50" />
                    Canchas
                </div>
                
                {/* Bottom Row - Estacionamiento (Spanning Cols 2-5) */}
                <div className="col-span-4 row-span-1 col-start-2 row-start-4 bg-slate-200 border-2 border-slate-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-slate-600 shadow-sm uppercase tracking-widest border-dashed">
                    Estacionamiento
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
                * Mapa ilustrativo no a escala
            </div>
        </div>

        {/* Directory List */}
        <div className="w-full lg:w-96 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-sm sticky top-0 bg-slate-50 py-2">Directorio</h3>
          {LOCATIONS.map(loc => (
            <div key={loc.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg text-white ${loc.color} shadow-md`}>
                <loc.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{loc.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{loc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};