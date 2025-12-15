import React, { useState } from 'react';
import { Search, Book, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  coverUrl: string;
}

const MOCK_BOOKS: BookItem[] = [
  { id: '1', title: 'Cálculo de Trascendentes Tempranas', author: 'James Stewart', category: 'Ingeniería', available: true, coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300' },
  { id: '2', title: 'Clean Code', author: 'Robert C. Martin', category: 'Informática', available: false, coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300' },
  { id: '3', title: 'Física Universitaria', author: 'Sears y Zemansky', category: 'Ciencias', available: true, coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=300' },
  { id: '4', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', category: 'Literatura', available: true, coverUrl: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=300' },
  { id: '5', title: 'Introducción a la Algoritmia', author: 'Cormen', category: 'Informática', available: true, coverUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=300' },
  { id: '6', title: 'Química Orgánica', author: 'McMurry', category: 'Ciencias', available: false, coverUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&q=80&w=300' },
];

export const LibrarySection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredBooks = MOCK_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || book.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...new Set(MOCK_BOOKS.map(b => b.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-[#FF8FE9]" />
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
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8FE9] shadow-sm"
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
                ? 'bg-[#FF8FE9] text-white shadow-md' 
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
              <span className="text-xs text-[#d147a3] font-semibold uppercase tracking-wider">{book.category}</span>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mt-1 mb-1 truncate" title={book.title}>{book.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{book.author}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center
                  ${book.available 
                    ? 'bg-slate-50 text-slate-700 hover:bg-[#FF8FE9] hover:text-white' 
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