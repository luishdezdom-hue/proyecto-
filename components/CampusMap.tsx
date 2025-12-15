import React from 'react';
import { MapPin, Building, Activity, BookOpen, GraduationCap, Microscope } from 'lucide-react';

const LOCATIONS = [
  { id: 1, name: 'Edificio A - Gobierno', icon: Building, desc: 'Rectoría, Servicios Escolares y Caja.', color: 'bg-blue-500' },
  { id: 2, name: 'Edificio B - Aulas', icon: GraduationCap, desc: 'Salones 101-120, Sala de Maestros.', color: 'bg-green-500' },
  { id: 3, name: 'Edificio C - Laboratorios', icon: Microscope, desc: 'Labs de Cómputo, Química y Física.', color: 'bg-purple-500' },
  { id: 4, name: 'Biblioteca Central', icon: BookOpen, desc: 'Acervo, Cubículos de estudio.', color: 'bg-orange-500' },
  { id: 5, name: 'Canchas Deportivas', icon: Activity, desc: 'Fútbol, Básquetbol y Gimnasio.', color: 'bg-red-500' },
  { id: 6, name: 'Cafetería', icon: MapPin, desc: 'Área de comida y esparcimiento.', color: 'bg-pink-500' },
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
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 p-8 relative min-h-[400px] shadow-inner overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Abstract layout of buildings */}
            <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full relative z-10">
                <div className="col-span-1 row-span-1 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-blue-800 shadow-sm">
                    Edificio A
                </div>
                <div className="col-span-1 row-span-2 bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-green-800 shadow-sm">
                    Edificio B (Aulas)
                </div>
                <div className="col-span-1 row-span-1 bg-pink-100 border-2 border-pink-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-pink-800 shadow-sm">
                    Cafetería
                </div>
                
                <div className="col-span-1 row-span-1 bg-orange-100 border-2 border-orange-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-orange-800 shadow-sm">
                    Biblioteca
                </div>
                <div className="col-span-1 row-span-2 bg-purple-100 border-2 border-purple-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-purple-800 shadow-sm">
                    Edificio C (Labs)
                </div>
                
                <div className="col-span-2 row-span-1 bg-red-100 border-2 border-red-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-red-800 shadow-sm mt-4">
                    Canchas Deportivas
                </div>
            </div>
            
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
                * Mapa ilustrativo no a escala
            </div>
        </div>

        {/* Directory List */}
        <div className="w-full lg:w-96 space-y-4">
          <h3 className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-sm">Directorio</h3>
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