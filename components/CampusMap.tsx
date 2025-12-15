import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Building, Activity, BookOpen, GraduationCap, Microscope, Presentation, Printer, Monitor, Plus, Trash2, Edit3, Move, GripHorizontal, Car, Layout } from 'lucide-react';

interface LocationItem {
  id: number;
  name: string;
  desc: string;
  color: string;
  icon?: any;
  // Grid Layout Properties
  x: number; // Grid Column Start
  y: number; // Grid Row Start
  w: number; // Grid Column Span
  h: number; // Grid Row Span
  locked?: boolean; // If true, visually distinct (like parking)
}

// Initial layout mapped from the previous hardcoded design
const INITIAL_LOCATIONS: LocationItem[] = [
  { id: 9, name: 'Papelería', icon: Printer, desc: 'Impresiones y material escolar.', color: 'bg-yellow-100', x: 1, y: 1, w: 1, h: 1 },
  { id: 6, name: 'Cafetería', icon: MapPin, desc: 'Área de comida y esparcimiento.', color: 'bg-green-100', x: 1, y: 2, w: 1, h: 3 },
  { id: 2, name: 'Edificio B - Aulas', icon: GraduationCap, desc: 'Salones 101-120.', color: 'bg-green-100', x: 2, y: 1, w: 1, h: 3 },
  { id: 100, name: 'Explanada Central', icon: Layout, desc: 'Área común.', color: 'bg-yellow-50', x: 3, y: 1, w: 1, h: 3, locked: true },
  { id: 1, name: 'Edificio A - Gobierno', icon: Building, desc: 'Rectoría y Servicios.', color: 'bg-blue-100', x: 4, y: 1, w: 1, h: 3 },
  { id: 5, name: 'Canchas Deportivas', icon: Activity, desc: 'Deportes y Gimnasio.', color: 'bg-red-100', x: 5, y: 1, w: 1, h: 3 },
  { id: 4, name: 'Biblioteca Central', icon: BookOpen, desc: 'Acervo bibliográfico.', color: 'bg-orange-100', x: 2, y: 2, w: 1, h: 1 }, // Placed inside/over Edificio B area logically or visually
  { id: 101, name: 'Estacionamiento', icon: Car, desc: 'Zona de aparcamiento.', color: 'bg-slate-200', x: 2, y: 4, w: 4, h: 1, locked: true },
];

const COLORS = [
  { name: 'Azul', class: 'bg-blue-100' },
  { name: 'Verde', class: 'bg-green-100' },
  { name: 'Rojo', class: 'bg-red-100' },
  { name: 'Amarillo', class: 'bg-yellow-100' },
  { name: 'Morado', class: 'bg-purple-100' },
  { name: 'Naranja', class: 'bg-orange-100' },
  { name: 'Rosa', class: 'bg-pink-100' },
  { name: 'Gris', class: 'bg-slate-200' },
  { name: 'Verde UMB', class: 'bg-[#41F73B]/20' },
];

interface CampusMapProps {
  userRole?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({ userRole }) => {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  
  // Interaction State
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [resizingId, setResizingId] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Admin Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0].class);

  // --- MOUSE HANDLERS FOR DRAG & RESIZE ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!gridRef.current) return;
        
        // Calculate grid cell dimensions based on container
        const gridRect = gridRef.current.getBoundingClientRect();
        const colWidth = gridRect.width / 5; // 5 columns fixed
        const rowHeight = 116; // 100px min-height + 16px gap (approx)

        // Mouse position relative to grid
        const relX = e.clientX - gridRect.left;
        const relY = e.clientY - gridRect.top;

        // Calculate target grid coordinates
        // Clamp values to ensure they stay roughly within bounds
        const targetCol = Math.max(1, Math.min(5, Math.ceil(relX / colWidth)));
        const targetRow = Math.max(1, Math.ceil(relY / rowHeight));

        if (draggingId !== null) {
            setLocations(prev => prev.map(loc => {
                if (loc.id === draggingId) {
                    return { ...loc, x: targetCol, y: targetRow };
                }
                return loc;
            }));
        } else if (resizingId !== null) {
            setLocations(prev => prev.map(loc => {
                if (loc.id === resizingId) {
                    // Calculate new width/height based on the difference between target and start
                    // We need to find the new span. 
                    // New Span = Target Col - Start Col + 1
                    const newW = Math.max(1, targetCol - loc.x + 1);
                    const newH = Math.max(1, targetRow - loc.y + 1);
                    return { ...loc, w: newW, h: newH };
                }
                return loc;
            }));
        }
    };

    const handleMouseUp = () => {
        setDraggingId(null);
        setResizingId(null);
    };

    if (draggingId !== null || resizingId !== null) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, resizingId]);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;

    // Find a spot at the bottom
    const maxY = Math.max(...locations.map(l => l.y + l.h), 1);

    const newLoc: LocationItem = {
      id: Date.now(),
      name: newName,
      desc: newDesc,
      color: newColor,
      icon: MapPin,
      x: 1,
      y: maxY, // Place at bottom
      w: 1,
      h: 1
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Mapa del Campus</h2>
        <p className="text-slate-500 mt-2">Ubica fácilmente todos los espacios de la UES Atenco.</p>
        {userRole === 'ADMIN' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg inline-block text-left max-w-2xl mx-auto">
             <p className="font-bold flex items-center justify-center mb-1"><Edit3 className="w-4 h-4 mr-2"/> Modo Edición Activado</p>
             <ul className="list-disc list-inside text-xs space-y-1">
                <li><strong>Mover:</strong> Haz clic y arrastra cualquier bloque para cambiar su posición.</li>
                <li><strong>Redimensionar:</strong> Arrastra el icono <GripHorizontal className="w-3 h-3 inline"/> en la esquina inferior derecha de un bloque para cambiar su tamaño.</li>
             </ul>
          </div>
        )}
      </div>

      {/* Admin Controls */}
      {userRole === 'ADMIN' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nueva Ubicación
          </h3>
          <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Ej. Nuevo Lab"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
              <input 
                type="text" 
                value={newDesc} 
                onChange={e => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="Ej. Área de..."
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
              <Plus className="w-4 h-4 mr-2" /> Agregar
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Visual Map Representation */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 p-8 relative min-h-[800px] shadow-inner overflow-hidden select-none">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Grid Container */}
            <div 
                ref={gridRef}
                className="grid grid-cols-5 gap-4 h-full relative z-10"
                style={{ 
                    gridAutoRows: '100px', // Base height unit
                }}
            >
                {locations.map((loc) => {
                    const Icon = loc.icon || MapPin;
                    // Determine styling based on "locked" visual or regular
                    const borderClass = loc.color.includes('bg-') ? loc.color.replace('bg-', 'border-').replace('/20', '') : 'border-slate-300';
                    const bgClass = loc.color;

                    return (
                        <div 
                            key={loc.id}
                            onMouseDown={(e) => {
                                if (userRole === 'ADMIN') {
                                    // Only start drag if not clicking the resize handle
                                    if (!(e.target as HTMLElement).closest('.resize-handle')) {
                                        setDraggingId(loc.id);
                                    }
                                }
                            }}
                            className={`
                                relative rounded-lg border-2 shadow-sm flex flex-col items-center justify-center p-2 text-center transition-all
                                ${bgClass} 
                                ${loc.locked ? 'border-dashed border-slate-400 text-slate-600' : `${borderClass} text-slate-800`}
                                ${userRole === 'ADMIN' ? 'cursor-move hover:shadow-md hover:ring-2 hover:ring-offset-1 hover:ring-blue-400' : ''}
                                ${draggingId === loc.id ? 'opacity-50 z-50 scale-105' : 'z-10'}
                            `}
                            style={{
                                gridColumnStart: loc.x,
                                gridColumnEnd: `span ${loc.w}`,
                                gridRowStart: loc.y,
                                gridRowEnd: `span ${loc.h}`,
                            }}
                        >
                            <Icon className={`w-6 h-6 mb-1 ${loc.locked ? 'opacity-40' : 'opacity-60'}`} />
                            <span className="text-xs font-bold leading-tight">{loc.name}</span>
                            
                            {/* Resize Handle (Admin Only) */}
                            {userRole === 'ADMIN' && (
                                <div 
                                    className="resize-handle absolute bottom-1 right-1 cursor-nwse-resize p-1 text-slate-400 hover:text-blue-600 bg-white/50 rounded-full"
                                    onMouseDown={(e) => {
                                        e.stopPropagation(); // Prevent drag start
                                        setResizingId(loc.id);
                                    }}
                                >
                                    <GripHorizontal className="w-4 h-4" />
                                </div>
                            )}
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
          <h3 className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-sm sticky top-0 bg-slate-50 py-2 z-20">Directorio</h3>
          {locations.map(loc => {
            const Icon = loc.icon || MapPin;
            return (
              <div key={loc.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow group">
                <div className={`p-3 rounded-lg ${loc.color.includes('/') ? 'bg-green-500 text-white' : loc.color} shadow-sm`}>
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