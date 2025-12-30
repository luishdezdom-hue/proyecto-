import React, { useState } from 'react';
import { Search, Book, BookOpen, Clock, AlertCircle, X, CheckCircle2, User, GraduationCap, FileBadge } from 'lucide-react';
import { LibraryReservation } from '../types';

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  coverUrl: string;
}

interface LibrarySectionProps {
    onReserve?: (data: Omit<LibraryReservation, 'id' | 'timestamp'>) => void;
}

const MOCK_BOOKS: BookItem[] = [
  { id: '1', title: 'Cálculo de Trascendentes Tempranas', author: 'James Stewart', category: 'Ingeniería', available: true, coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300' },
  { id: '2', title: 'Clean Code', author: 'Robert C. Martin', category: 'Informática', available: false, coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300' },
  { id: '3', title: 'Física Universitaria', author: 'Sears y Zemansky', category: 'Ciencias', available: true, coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=300' },
  { id: '4', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', category: 'Literatura', available: true, coverUrl: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=300' },
  { id: '5', title: 'Introducción a la Algoritmia', author: 'Cormen', category: 'Informática', available: true, coverUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=300' },
  { id: '6', title: 'Química Orgánica', author: 'McMurry', category: 'Ciencias', available: false, coverUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&q=80&w=300' },
  { id: '7', title: 'Inteligencia Artificial: Un Enfoque Moderno', author: 'Stuart Russell', category: 'Informática', available: true, coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=300' },
  { id: '8', title: 'Principios de Economía', author: 'Gregory Mankiw', category: 'Ciencias Sociales', available: true, coverUrl: 'https://images.unsplash.com/photo-1554774853-719586f8c277?auto=format&fit=crop&q=80&w=300' },
  { id: '9', title: 'Biología Molecular de la Célula', author: 'Bruce Alberts', category: 'Ciencias', available: true, coverUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=300' },
  { id: '10', title: 'Historia Mínima de México', author: 'Varios Autores', category: 'Historia', available: false, coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=300' },
  { id: '11', title: 'Estructura de Datos en Java', author: 'Mark A. Weiss', category: 'Informática', available: true, coverUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=300' },
  { id: '12', title: 'Mecánica Vectorial para Ingenieros', author: 'Beer & Johnston', category: 'Ingeniería', available: true, coverUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=300' },
];

export const LibrarySection: React.FC<LibrarySectionProps> = ({ onReserve }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  
  // Reservation Modal State
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    career: '',
    matricula: ''
  });

  const filteredBooks = MOCK_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || book.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...new Set(MOCK_BOOKS.map(b => b.category))];

  const handleOpenReservation = (book: BookItem) => {
    setSelectedBook(book);
    setFormData({ name: '', career: '', matricula: '' });
    setIsModalOpen(true);
    setShowSuccess(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onReserve && selectedBook) {
        onReserve({
            studentName: formData.name,
            matricula: formData.matricula,
            career: formData.career,
            bookTitle: selectedBook.title,
            bookAuthor: selectedBook.author
        });
    }
    
    // Show success state
    setIsModalOpen(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center animate-fade-in-down">
          <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
          <div>
            <h4 className="font-bold">¡Reserva Exitosa!</h4>
            <p className="text-sm">Pasa a recoger tu libro en las próximas 24 horas.</p>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-[#41F73B] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center">
                <Book className="w-5 h-5 mr-2" />
                Reservar Libro
              </h3>
              <button onClick={handleCloseModal} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-16 h-24 object-cover rounded shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{selectedBook.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{selectedBook.author}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {selectedBook.category}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitReservation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-1 text-slate-400" /> Nombre Completo
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] focus:border-[#41F73B] outline-none transition-all text-sm bg-white"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1 text-slate-400" /> Carrera
                  </label>
                  <select 
                    required
                    value={formData.career}
                    onChange={e => setFormData({...formData, career: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] focus:border-[#41F73B] outline-none transition-all text-sm bg-white"
                  >
                    <option value="">Selecciona tu carrera...</option>
                    <option value="Ingeniería en TIC'S">Ingeniería en TIC'S</option>
                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                    <option value="Licenciatura en Derecho">Licenciatura en Derecho</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                    <FileBadge className="w-4 h-4 mr-1 text-slate-400" /> Matrícula
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.matricula}
                    onChange={e => setFormData({...formData, matricula: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] focus:border-[#41F73B] outline-none transition-all text-sm bg-white"
                    placeholder="Ej. 202300159"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-[#41F73B] text-white rounded-xl font-bold shadow-md hover:bg-green-500 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-[#41F73B]" />
            Biblioteca Universitaria
          </h2>
          <p className="text-slate-500 mt-2">Consulta el acervo bibliográfico y disponibilidad.</p>
        </div>
        
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por título o autor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41F73B] shadow-sm bg-white"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === cat 
                ? 'bg-[#41F73B] text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-48 overflow-hidden relative">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {book.available ? 'Disponible' : 'Prestado'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs text-green-600 font-semibold uppercase tracking-wider">{book.category}</span>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mt-1 mb-1 truncate" title={book.title}>{book.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{book.author}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button 
                  onClick={() => book.available && handleOpenReservation(book)}
                  disabled={!book.available}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center
                  ${book.available 
                    ? 'bg-slate-50 text-slate-700 hover:bg-[#41F73B] hover:text-white' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}>
                  <Book className="w-4 h-4 mr-2" />
                  {book.available ? 'Reservar' : 'No disponible'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col md:flex-row items-start gap-4">
        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-blue-800 mb-1">Horario de Atención</h4>
          <p className="text-sm text-blue-700 flex items-center mt-1">
            <Clock className="w-4 h-4 mr-2" />
            Lunes a Viernes: 7:00 AM - 8:00 PM | Sábados: 9:00 AM - 2:00 PM
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Recuerda que para préstamos a domicilio es necesario presentar tu credencial vigente.
          </p>
        </div>
      </div>
    </div>
  );
};