import React, { useState } from 'react';
import { MapPin, Building, Activity, BookOpen, GraduationCap, Microscope, Presentation, Printer, Monitor, Plus, Trash2, Edit3 } from 'lucide-react';

interface LocationItem {
  id: number;
  name: string;
  desc: string;
  color: string;
  icon?: any;
}

const INITIAL_LOCATIONS: LocationItem[] = [
  { id: 1, name: 'Edificio A - Gobierno', icon: Building, desc: 'Rectoría, Servicios Escolares y Caja.', color: 'bg-blue-500' },
  { id: 2, name: 'Edificio B - Aulas', icon: GraduationCap, desc: 'Salones 101-120, Sala de Maestros.', color: 'bg-green-500' },
  { id: 3, name: 'Edificio C - Laboratorios', icon: Microscope, desc: 'Labs de Cómputo, Química y Física.', color: 'bg-purple-500' },
  { id: 4, name: 'Biblioteca Central', icon: BookOpen, desc: 'Acervo, Cubículos de estudio.', color: 'bg-orange-500' },
  { id: 5, name: 'Canchas Deportivas', icon: Activity, desc: 'Fútbol, Básquetbol y Gimnasio.', color: 'bg-red-500' },
  { id: 6, name: 'Cafetería', icon: MapPin, desc: 'Área de comida y esparcimiento.', color: 'bg-[#41F73B]' },
  { id: 7, name: 'Auditorio', icon: Presentation, desc: 'Conferencias y eventos culturales.', color: 'bg-indigo-500' },
  { id: 9, name: 'Papelería', icon: Printer, desc: 'Impresiones y material escolar.', color: 'bg-yellow-600' },
  { id: 11, name: 'Centro de Cómputo', icon: Monitor, desc: 'Equipos especializados para Ingeniería.', color: 'bg-cyan-600' },
];

const COLORS = [
  { name: 'Azul', class: 'bg-blue-500' },
  { name: 'Verde', class: 'bg-green-500' },
  { name: 'Rojo', class: 'bg-red-500' },
  { name: 'Amarillo', class: 'bg-yellow-500' },
  { name: 'Morado', class: 'bg-purple-500' },
  { name: 'Naranja', class: 'bg-orange-500' },
  { name: 'Rosa', class: 'bg-pink-500' },
  { name: 'Gris', class: 'bg-slate-500' },
  { name: 'Verde UMB', class: 'bg-[#41F73B]' },
];

interface CampusMapProps {
  userRole?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({ userRole }) => {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  
  // Admin Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0].class);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;

    const newLoc: LocationItem = {
      id: Date.now(),
      name: newName,
      desc: newDesc,
      color: newColor,
      icon: MapPin // Default icon for dynamic items
    };

    setLocations([...locations, newLoc]);
    setNewName('');
    setNewDesc('');
  };

  const handleDeleteLocation = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta ubicación?')) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };

  // Separate static (original complex layout) items from dynamic ones for visual mapping
  // Note: For this simplified editor, we assume IDs 1-11 correspond to the complex grid layout
  // and new items will flow in a flexible grid area.
  const dynamicLocations = locations.filter(l => l.id > 20); // Assuming mock IDs are small, timestamp IDs are large

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Mapa del Campus</h2>
        <p className="text-slate-500 mt-2">Ubica fácilmente todos los espacios de la UES Atenco.</p>
        {userRole === 'ADMIN' && (
          <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
            Modo Edición Activado
          </span>
        )}
      </div>

      {/* Admin Controls */}
      {userRole === 'ADMIN' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Edit3 className="w-5 h-5 mr-2" />
            Panel de Edición de Mapa
          </h3>
          <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Lugar</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Ej. Nuevo Laboratorio"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
              <input 
                type="text" 
                value={newDesc} 
                onChange={e => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Ej. Área de Biología"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Color</label>
              <select 
                value={newColor} 
                onChange={e => setNewColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {COLORS.map(c => (
                  <option key={c.name} value={c.class}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" /> Agregar Ubicación
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Visual Map Representation */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 p-8 relative min-h-[600px] shadow-inner">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="grid grid-cols-5 auto-rows-[minmax(100px,auto)] gap-4 h-full relative z-10">
                
                {/* --- HARDCODED COMPLEX LAYOUT (Existing Buildings) --- */}
                {/* Only render if they exist in the locations state (allows "deletion" although layout might break visually, it's safer to keep layout static and just hide content if deleted) */}
                
                {/* Papelería */}
                {locations.find(l => l.id === 9) && (
                  <div className="col-span-1 row-span-1 bg-yellow-100 border-2 border-yellow-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-yellow-800 shadow-sm flex-col">
                      <Printer className="w-5 h-5 mb-1 opacity-50" />
                      Papelería
                  </div>
                )}

                {/* Cafeteria */}
                {locations.find(l => l.id === 6) && (
                  <div className="col-span-1 row-span-3 bg-green-100 border-2 border-[#41F73B] border-r-4 border-r-green-300/50 border-dashed rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-green-800 shadow-sm flex-col relative">
                      <div className="absolute right-[-18px] top-0 bottom-0 w-1 border-r-2 border-slate-300 border-dashed h-full"></div>
                      <MapPin className="w-6 h-6 mb-2 opacity-50" />
                      Cafetería
                  </div>
                )}

                {/* Edificio B + Biblioteca */}
                {locations.find(l => l.id === 2) && (
                  <div className="col-span-1 row-span-3 col-start-2 bg-green-100 border-2 border-green-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-green-800 shadow-sm flex-col">
                      <GraduationCap className="w-6 h-6 mb-1 opacity-50" />
                      Edificio B
                      {locations.find(l => l.id === 4) && (
                        <div className="bg-orange-100 border border-orange-300 rounded px-2 py-1 mt-2 w-full">
                          <BookOpen className="w-4 h-4 mx-auto mb-1 text-orange-600" />
                          <span className="text-[9px] text-orange-800 block leading-tight">Biblioteca</span>
                        </div>
                      )}
                  </div>
                )}

                {/* Explanada */}
                <div className="col-span-1 row-span-3 col-start-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-yellow-800 shadow-sm border-dashed">
                    Explanada Central
                </div>

                {/* Edificio A */}
                {locations.find(l => l.id === 1) && (
                  <div className="col-span-1 row-span-3 col-start-4 bg-blue-100 border-2 border-blue-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-blue-800 shadow-sm flex-col">
                      <Building className="w-6 h-6 mb-2 opacity-50" />
                      Edificio A
                  </div>
                )}

                {/* Canchas */}
                {locations.find(l => l.id === 5) && (
                  <div className="col-span-1 row-span-3 col-start-5 bg-red-100 border-2 border-red-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-red-800 shadow-sm flex-col">
                      <Activity className="w-5 h-5 mb-1 opacity-50" />
                      Canchas
                  </div>
                )}
                
                {/* Estacionamiento */}
                <div className="col-span-4 row-span-1 col-start-2 row-start-4 bg-slate-200 border-2 border-slate-400 rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold text-slate-600 shadow-sm uppercase tracking-widest border-dashed">
                    Estacionamiento
                </div>

                {/* --- DYNAMIC ADDITIONS --- */}
                {dynamicLocations.map((loc) => {
                  // Determine background color style based on the stored class or simplified logic
                  const borderColor = loc.color.replace('bg-', 'border-');
                  return (
                    <div key={loc.id} className={`col-span-1 row-span-1 ${loc.color.replace('500', '100')} border-2 ${borderColor} rounded-lg flex items-center justify-center p-2 text-center text-xs font-bold shadow-sm flex-col min-h-[100px]`}>
                      <MapPin className="w-5 h-5 mb-1 opacity-50" />
                      {loc.name}
                    </div>
                  );
                })}
            </div>
            
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
                * Mapa ilustrativo
            </div>
        </div>

        {/* Directory List */}
        <div className="w-full xl:w-96 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-sm sticky top-0 bg-slate-50 py-2">Directorio</h3>
          {locations.map(loc => {
            const Icon = loc.icon || MapPin;
            return (
              <div key={loc.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow group">
                <div className={`p-3 rounded-lg text-white ${loc.color} shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{loc.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{loc.desc}</p>
                </div>
                {userRole === 'ADMIN' && (
                  <button 
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    title="Eliminar ubicación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};