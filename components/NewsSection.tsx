import React, { useState } from 'react';
import { NewsItem } from '../types';
import { generateNewsSummary } from '../services/geminiService';
import { Sparkles, ArrowRight, ArrowLeft, Clock, Tag, Globe, GraduationCap, Plus, Trash2, X, Image as ImageIcon, FileText } from 'lucide-react';

interface NewsSectionProps {
  userRole?: string;
  internalNews: NewsItem[];
  externalNews: NewsItem[];
  onAddNews: (item: NewsItem, type: 'INTERNAL' | 'EXTERNAL') => void;
  onDeleteNews: (id: string, type: 'INTERNAL' | 'EXTERNAL') => void;
  onUpdateNews: (item: NewsItem, type: 'INTERNAL' | 'EXTERNAL') => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ 
  userRole, 
  internalNews, 
  externalNews, 
  onAddNews, 
  onDeleteNews,
  onUpdateNews
}) => {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for new news
  const [newNews, setNewNews] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: 'Academic' as NewsItem['category']
  });

  const handleEnhanceSummary = async (id: string, title: string) => {
    setLoadingAi(id);
    const newSummary = await generateNewsSummary(title);
    
    const article = (activeTab === 'INTERNAL' ? internalNews : externalNews).find(n => n.id === id);
    if (article) {
        onUpdateNews({ ...article, summary: newSummary }, activeTab);
    }
    
    setLoadingAi(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: NewsItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...newNews,
      date: new Date().toISOString().split('T')[0]
    };
    onAddNews(item, activeTab);
    setIsAddModalOpen(false);
    setNewNews({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        category: 'Academic'
    });
  };

  const currentNews = activeTab === 'INTERNAL' ? internalNews : externalNews;
  const isAdmin = userRole === 'ADMIN';

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Noticias
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img 
              src={selectedArticle.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop'} 
              alt={selectedArticle.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
               <div className="flex items-center space-x-3 text-white/90 text-sm font-medium mb-3">
                  <span className="bg-[#41F73B] text-slate-900 px-3 py-1 rounded-full">{selectedArticle.category}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedArticle.date}</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {selectedArticle.title}
               </h1>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                {selectedArticle.content || selectedArticle.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Admin Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                <h3 className="font-bold text-lg flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-[#41F73B]" />
                    Publicar Nueva Noticia ({activeTab === 'INTERNAL' ? 'UMB' : 'Externa'})
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                        <FileText className="w-4 h-4 mr-1.5 text-slate-400" /> Título
                    </label>
                    <input 
                        type="text" 
                        required
                        value={newNews.title}
                        onChange={e => setNewNews({...newNews, title: e.target.value})}
                        className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] outline-none bg-white"
                        placeholder="Ej. Resultados del Torneo"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                    <select 
                        value={newNews.category}
                        onChange={e => setNewNews({...newNews, category: e.target.value as NewsItem['category']})}
                        className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] outline-none bg-white"
                    >
                        <option value="Academic">Académico</option>
                        <option value="Sports">Deportes</option>
                        <option value="Social">Social</option>
                        <option value="Campus">Campus / Vialidad</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-1.5 text-slate-400" /> URL de Imagen
                    </label>
                    <input 
                        type="url" 
                        required
                        value={newNews.imageUrl}
                        onChange={e => setNewNews({...newNews, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] outline-none bg-white"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resumen Corto</label>
                    <textarea 
                        required
                        value={newNews.summary}
                        onChange={e => setNewNews({...newNews, summary: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] outline-none resize-none bg-white"
                        placeholder="Breve descripción para la tarjeta..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contenido Completo</label>
                    <textarea 
                        required
                        value={newNews.content}
                        onChange={e => setNewNews({...newNews, content: e.target.value})}
                        rows={5}
                        className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-[#41F73B] outline-none resize-y bg-white"
                        placeholder="Escribe el artículo completo aquí..."
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-[#41F73B] hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                >
                    Publicar Ahora
                </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Noticias y Avisos</h2>
          <p className="text-slate-500 mt-2">Mantente informado de lo que sucede dentro y fuera del campus.</p>
        </div>
        {isAdmin && (
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#41F73B] hover:bg-green-500 text-white font-bold py-2.5 px-5 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center"
            >
                <Plus className="w-5 h-5 mr-2" /> Agregar Noticia
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('INTERNAL')}
          className={`pb-3 px-1 text-sm font-bold transition-all flex items-center relative ${
            activeTab === 'INTERNAL'
              ? 'text-[#41F73B]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Noticias Universitarias
          {activeTab === 'INTERNAL' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#41F73B] rounded-t-full"></span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('EXTERNAL')}
          className={`pb-3 px-1 text-sm font-bold transition-all flex items-center relative ${
            activeTab === 'EXTERNAL'
              ? 'text-[#41F73B]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Globe className="w-5 h-5 mr-2" />
          Noticias Externas
          {activeTab === 'EXTERNAL' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#41F73B] rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        {currentNews.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-slate-100 relative group">
            {/* Admin Controls */}
            {isAdmin && (
                <button 
                    onClick={() => {
                        if(window.confirm('¿Seguro que deseas borrar esta noticia?')) {
                            onDeleteNews(item.id, activeTab);
                        }
                    }}
                    className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Borrar Noticia"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}

            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.imageUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop'} 
                alt={item.title} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-green-600 shadow-sm flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {item.category}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center text-slate-400 text-xs mb-3 space-x-2">
                <Clock className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-[#41F73B] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-6 flex-1 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedArticle(item)}
                  className="text-green-600 text-sm font-semibold hover:text-green-800 flex items-center group"
                >
                  Leer más <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => handleEnhanceSummary(item.id, item.title)}
                  disabled={loadingAi === item.id}
                  className="text-xs flex items-center bg-green-50 text-green-700 px-2 py-1.5 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                  title="Generate detailed summary with AI"
                >
                  <Sparkles className={`w-3 h-3 mr-1 ${loadingAi === item.id ? 'animate-spin' : ''}`} />
                  {loadingAi === item.id ? 'Generando...' : 'AI Resumen'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {currentNews.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400 font-medium">No hay noticias publicadas en esta sección.</p>
              {isAdmin && <button onClick={() => setIsAddModalOpen(true)} className="mt-4 text-[#41F73B] font-bold hover:underline">Publicar la primera</button>}
          </div>
      )}
    </div>
  );
};