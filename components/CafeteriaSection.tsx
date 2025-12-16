import React, { useState } from 'react';
import { Coffee, Utensils, Sandwich, CircleDollarSign, Plus, ShoppingBag, Trash2, Receipt, Clock, Info, X, CreditCard, Banknote, QrCode, Phone, CheckCircle2, User, FileBadge } from 'lucide-react';

interface MenuItem {
  name: string;
  price: number;
  desc: string;
  ingredients?: string[];
  prepTime?: string;
}

interface MenuSection {
  category: string;
  items: MenuItem[];
}

const MENU_ITEMS: MenuSection[] = [
  { category: 'Desayunos', items: [
    { 
      name: 'Chilaquiles Verdes/Rojos', 
      price: 45, 
      desc: 'Con pollo o huevo, crema y queso.',
      ingredients: ['Tortilla frita (Totopos)', 'Salsa verde o roja casera', 'Pollo deshebrado o Huevo estrellado', 'Crema ácida', 'Queso fresco', 'Cebolla', 'Cilantro'],
      prepTime: '10 - 15 min'
    },
    { 
      name: 'Molletes', 
      price: 35, 
      desc: '2 piezas con frijoles, queso y pico de gallo.',
      ingredients: ['Bolillo artesanal', 'Frijoles refritos', 'Queso manchego gratinado', 'Pico de gallo (Jitomate, cebolla, chile)'],
      prepTime: '8 - 12 min'
    },
    { 
      name: 'Huevos al gusto', 
      price: 40, 
      desc: 'Acompañados de frijoles y tortillas.',
      ingredients: ['2 Huevos', 'Ingrediente a elegir (Jamón, Salchicha, Chorizo)', 'Frijoles refritos', 'Tortillas de maíz'],
      prepTime: '10 min'
    },
  ]},
  { category: 'Comida', items: [
    { 
      name: 'Menú Ejecutivo', 
      price: 65, 
      desc: 'Sopa, plato fuerte, agua y postre.',
      ingredients: ['Sopa del día (Pasta o Consomé)', 'Guisado del día (Cambia diariamente)', 'Arroz o Frijoles', 'Agua de sabor (500ml)', 'Postre pequeño'],
      prepTime: 'Listo para servir (3-5 min)'
    },
    { 
      name: 'Torta de Milanesa', 
      price: 45, 
      desc: 'Con aguacate, jitomate y cebolla.',
      ingredients: ['Telera', 'Milanesa de Res o Pollo', 'Frijoles', 'Mayonesa', 'Aguacate', 'Jitomate', 'Cebolla', 'Lechuga', 'Chiles en vinagre'],
      prepTime: '10 - 15 min'
    },
    { 
      name: 'Ensalada César con Pollo', 
      price: 55, 
      desc: 'Lechuga, crutones, parmesano y aderezo.',
      ingredients: ['Mix de lechugas', 'Pechuga de pollo a la plancha', 'Crutones con ajo', 'Queso parmesano rallado', 'Aderezo César casero'],
      prepTime: '10 min'
    },
  ]},
  { category: 'Bebidas y Snacks', items: [
    { name: 'Café Americano', price: 20, desc: '12 oz.', prepTime: '2 min' },
    { name: 'Licuado de Frutas', price: 25, desc: 'Fresa, plátano o chocolate.', ingredients: ['Leche entera o deslactosada', 'Fruta natural', 'Azúcar o Miel'], prepTime: '5 min' },
    { name: 'Refresco', price: 18, desc: 'Lata 355ml.', prepTime: 'Inmediato' },
  ]}
];

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

export const CafeteriaSection: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // UI States
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Checkout Form State
  const [userData, setUserData] = useState({ name: '', matricula: '' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [transferData, setTransferData] = useState({ reference: '' });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { name: item.name, price: item.price, quantity: 1 }];
    });
    setSelectedItem(null); // Close modal after adding
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

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setOrderSuccess(true);
    setCart([]);
    setUserData({ name: '', matricula: '' });
    setPaymentMethod('CASH');
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* SUCCESS NOTIFICATION */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
           <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Pedido Confirmado!</h3>
              <p className="text-slate-600 mb-6">Tu orden ha sido enviada a cocina. Pasa a recogerla en la barra.</p>
              <button onClick={() => setOrderSuccess(false)} className="bg-[#41F73B] text-white px-6 py-2 rounded-lg font-bold w-full">Entendido</button>
           </div>
        </div>
      )}

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up relative">
            <button 
                onClick={() => setSelectedItem(null)} 
                className="absolute top-4 right-4 bg-slate-100 p-1 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            
            <div className="bg-[#41F73B] p-6 pb-8">
                <h3 className="text-2xl font-bold text-white pr-6">{selectedItem.name}</h3>
                <span className="inline-block mt-2 bg-white/20 text-white font-bold px-3 py-1 rounded-full">
                    ${selectedItem.price} MXN
                </span>
            </div>

            <div className="p-6 -mt-4 bg-white rounded-t-2xl">
                <p className="text-slate-600 mb-6 italic">{selectedItem.desc}</p>
                
                {selectedItem.prepTime && (
                    <div className="flex items-center text-slate-700 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <Clock className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase block">Tiempo Estimado</span>
                            <span className="font-medium">{selectedItem.prepTime}</span>
                        </div>
                    </div>
                )}

                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                    <div className="mb-6">
                        <h4 className="flex items-center font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
                            <Info className="w-4 h-4 mr-2 text-[#41F73B]" /> Ingredientes
                        </h4>
                        <ul className="grid grid-cols-1 gap-2">
                            {selectedItem.ingredients.map((ing, idx) => (
                                <li key={idx} className="text-sm text-slate-600 flex items-start">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 shrink-0"></span>
                                    {ing}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button 
                    onClick={() => addToCart(selectedItem)}
                    className="w-full bg-[#41F73B] hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" /> Agregar al Pedido
                </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                <h3 className="font-bold text-lg flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-[#41F73B]" />
                    Confirmar Pedido
                </h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="p-6 overflow-y-auto custom-scrollbar">
                {/* 1. Datos del Usuario */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Datos del Estudiante</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                                <User className="w-4 h-4 mr-1.5 text-slate-400" /> Nombre Completo
                            </label>
                            <input 
                                type="text" 
                                required
                                value={userData.name}
                                onChange={e => setUserData({...userData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#41F73B] focus:outline-none"
                                placeholder="Ej. Ana García"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                                <FileBadge className="w-4 h-4 mr-1.5 text-slate-400" /> Matrícula
                            </label>
                            <input 
                                type="text" 
                                required
                                value={userData.matricula}
                                onChange={e => setUserData({...userData, matricula: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#41F73B] focus:outline-none"
                                placeholder="Ej. 20214567"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Método de Pago */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Forma de Pago</h4>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('CASH')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'CASH' ? 'border-[#41F73B] bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Banknote className="w-6 h-6 mb-1" />
                            <span className="text-xs font-bold">Efectivo</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('CARD')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'CARD' ? 'border-[#41F73B] bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <CreditCard className="w-6 h-6 mb-1" />
                            <span className="text-xs font-bold">Tarjeta</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('TRANSFER')}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${paymentMethod === 'TRANSFER' ? 'border-[#41F73B] bg-green-50 text-green-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <QrCode className="w-6 h-6 mb-1" />
                            <span className="text-xs font-bold">Transf.</span>
                        </button>
                    </div>

                    {/* Conditional Payment Inputs */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        {paymentMethod === 'CASH' && (
                            <div className="flex items-start text-sm text-slate-600">
                                <Info className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                                <p>Al confirmar, su pedido comenzará a prepararse. <strong>Deberá pagar el total de ${total.toFixed(2)} al momento de recoger</strong> en la barra de la cafetería para recibir sus alimentos.</p>
                            </div>
                        )}

                        {paymentMethod === 'CARD' && (
                            <div className="space-y-3 animate-fade-in">
                                <input 
                                    type="text" 
                                    placeholder="Nombre en la tarjeta"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#41F73B]"
                                    required
                                    value={cardData.name}
                                    onChange={e => setCardData({...cardData, name: e.target.value})}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Número de tarjeta"
                                    maxLength={16}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#41F73B]"
                                    required
                                    value={cardData.number}
                                    onChange={e => setCardData({...cardData, number: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="MM/AA"
                                        maxLength={5}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#41F73B]"
                                        required
                                        value={cardData.expiry}
                                        onChange={e => setCardData({...cardData, expiry: e.target.value})}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="CVC"
                                        maxLength={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#41F73B]"
                                        required
                                        value={cardData.cvc}
                                        onChange={e => setCardData({...cardData, cvc: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'TRANSFER' && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="text-xs text-slate-500 mb-2">
                                    <p>Banco: <span className="font-bold text-slate-700">BBVA</span></p>
                                    <p>CLABE: <span className="font-bold text-slate-700">012 180 0155443322 1</span></p>
                                    <p>Concepto: <span className="font-bold text-slate-700">CAFETERIA-{userData.matricula || 'MAT'}</span></p>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Ingresa Clave de Rastreo / Referencia"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#41F73B]"
                                    required
                                    value={transferData.reference}
                                    onChange={e => setTransferData({...transferData, reference: e.target.value})}
                                />
                                <p className="text-[10px] text-orange-500">
                                    * Es necesario mostrar la captura de pantalla al recoger.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between font-bold text-xl text-slate-900 border-t border-slate-100 pt-4 mb-6">
                    <span>Total a Pagar:</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <button 
                    type="submit"
                    disabled={!userData.name || !userData.matricula}
                    className="w-full bg-[#41F73B] hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Finalizar Pedido
                </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
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
                    onClick={() => handleItemClick(item)}
                    className="w-full text-left p-4 hover:bg-green-50 transition-colors group flex justify-between items-center"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 group-hover:text-green-700">{item.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{item.desc}</p>
                      <span className="font-bold text-green-600 inline-flex items-center text-sm bg-green-100 px-2 py-0.5 rounded-full">
                        <CircleDollarSign className="w-3 h-3 mr-1" />
                        ${item.price}
                      </span>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-[#41F73B] group-hover:text-white transition-all shrink-0">
                        {section.category === 'Bebidas y Snacks' ? <Plus className="w-5 h-5" /> : <Info className="w-5 h-5" />}
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
                
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#41F73B] hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center"
                >
                  Confirmar Pedido
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3">
                  Se abrirán opciones de pago al confirmar.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOOTER - CONTACT NUMBERS */}
      <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
        <h3 className="text-2xl font-bold mb-4">¿Hambre entre clases? ¡Llama y recoge!</h3>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          Si tienes prisa, realiza tu pedido por teléfono y pasa a recoger sin hacer fila.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="tel:+525512345678" className="bg-[#41F73B] hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Cafetería Principal: 55-1234-5678
            </a>
            <a href="tel:+525587654321" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Barra de Snacks: 55-8765-4321
            </a>
        </div>
      </div>
    </div>
  );
};