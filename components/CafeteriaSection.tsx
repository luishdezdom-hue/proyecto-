import React, { useState } from 'react';
import { Coffee, Utensils, Sandwich, CircleDollarSign, Plus, ShoppingBag, Trash2, Receipt } from 'lucide-react';

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

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export const CafeteriaSection: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: { name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => prev.filter(i => i.name !== itemName));
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.name === itemName) {
          return { ...i, quantity: Math.max(0, i.quantity + delta) };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center">
          <Coffee className="w-10 h-10 mr-4 text-[#41F73B]" />
          Cafetería Universitaria
        </h2>
        <p className="text-slate-500 mt-3 text-lg">Menú del día y lista de precios.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Menu Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {MENU_ITEMS.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-fit">
              <div className="bg-[#41F73B] p-4 text-white flex items-center justify-center">
                {section.category === 'Desayunos' && <Utensils className="w-6 h-6 mr-2" />}
                {section.category === 'Comida' && <Sandwich className="w-6 h-6 mr-2" />}
                {section.category === 'Bebidas y Snacks' && <Coffee className="w-6 h-6 mr-2" />}
                <h3 className="text-xl font-bold tracking-wide">{section.category}</h3>
              </div>
              
              <div className="divide-y divide-slate-100">
                {section.items.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => addToCart(item)}
                    className="w-full text-left p-4 hover:bg-green-50 transition-colors group flex justify-between items-center"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 group-hover:text-green-700">{item.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
                      <span className="font-bold text-green-600 inline-flex items-center text-sm bg-green-100 px-2 py-0.5 rounded-full">
                        <CircleDollarSign className="w-3 h-3 mr-1" />
                        ${item.price}
                      </span>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-[#41F73B] group-hover:text-white transition-all">
                      <Plus className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary / Cart */}
        <div className="w-full xl:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 xl:sticky xl:top-24 animate-fade-in">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <ShoppingBag className="w-6 h-6 mr-2 text-[#41F73B]" />
              Tu Pedido
            </h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
              {cart.reduce((c, i) => c + i.quantity, 0)} items
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Selecciona productos del menú para agregarlos a tu lista.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">${item.price} c/u</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.name, -1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.name, 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-50 hover:text-green-500 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.name)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 border-dashed">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium">Total a Pagar</span>
                  <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                </div>
                
                <button className="w-full bg-[#41F73B] hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center">
                  Confirmar Pedido
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3">
                  Pago en efectivo al recoger en cafetería.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
        <h3 className="text-2xl font-bold mb-4">¿Hambre entre clases?</h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Haz tus pedidos anticipados a través de WhatsApp y recoge sin hacer fila.
        </p>
        <button className="bg-[#41F73B] hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
          Ver número de pedidos
        </button>
      </div>
    </div>
  );
};