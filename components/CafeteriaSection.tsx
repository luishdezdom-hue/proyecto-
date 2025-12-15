import React from 'react';
import { Coffee, Utensils, Sandwich, CircleDollarSign } from 'lucide-react';

const MENU_ITEMS = [
  { category: 'Desayunos', items: [
    { name: 'Chilaquiles Verdes/Rojos', price: 45, desc: 'Con pollo o huevo, crema y queso.' },
    { name: 'Molletes', price: 35, desc: '2 piezas con frijoles, queso y pico de gallo.' },
    { name: 'Huevos al gusto', price: 40, desc: 'Acompañados de frijoles y tortillas.' },
  ]},
  { category: 'Comida', items: [
    { name: 'Menú Ejecutivo', price: 65, desc: 'Sopa, plato fuerte, agua y postre.' },
    { name: 'Torta de Milanesa', price: 45, desc: 'Con aguacate, jitomate y cebolla.' },
    { name: 'Ensalada César con Pollo', price: 55, desc: 'Lechuga, crutones, parmesano y aderezo.' },
  ]},
  { category: 'Bebidas y Snacks', items: [
    { name: 'Café Americano', price: 20, desc: '12 oz.' },
    { name: 'Licuado de Frutas', price: 25, desc: 'Fresa, plátano o chocolate.' },
    { name: 'Refresco', price: 18, desc: 'Lata 355ml.' },
  ]}
];

export const CafeteriaSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center">
          <Coffee className="w-10 h-10 mr-4 text-[#FF8FE9]" />
          Cafetería Universitaria
        </h2>
        <p className="text-slate-500 mt-3 text-lg">Menú del día y lista de precios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MENU_ITEMS.map((section, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-[#FF8FE9] p-4 text-white flex items-center justify-center">
              {section.category === 'Desayunos' && <Utensils className="w-6 h-6 mr-2" />}
              {section.category === 'Comida' && <Sandwich className="w-6 h-6 mr-2" />}
              {section.category === 'Bebidas y Snacks' && <Coffee className="w-6 h-6 mr-2" />}
              <h3 className="text-xl font-bold tracking-wide">{section.category}</h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {section.items.map((item, i) => (
                <div key={i} className="p-4 hover:bg-pink-50 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-[#d147a3]">{item.name}</h4>
                    <span className="font-bold text-[#FF8FE9] flex items-center text-sm bg-pink-100 px-2 py-0.5 rounded-full">
                      <CircleDollarSign className="w-3 h-3 mr-1" />
                      {item.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
        <h3 className="text-2xl font-bold mb-4">¿Hambre entre clases?</h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Haz tus pedidos anticipados a través de WhatsApp y recoge sin hacer fila.
        </p>
        <button className="bg-[#FF8FE9] hover:bg-[#ff76e5] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
          Ver número de pedidos
        </button>
      </div>
    </div>
  );
};