import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { generateNewsSummary } from '../services/geminiService';
import { Sparkles, ArrowRight, ArrowLeft, Clock, Tag } from 'lucide-react';

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Villancicos',
    summary: 'En la UES Atenco celebramos con gran entusiasmo nuestra Exposición de Villancicos, el tradicional Encendido del Árbol Navideño y el Concurso de Piñatas.',
    content: `En la UES Atenco celebramos con gran entusiasmo nuestra Exposición de Villancicos, el tradicional Encendido del Árbol Navideño y el Concurso de Piñatas, actividades que reunieron a estudiantes, docentes y personal administrativo en un ambiente de convivencia y espíritu festivo.
Estos espacios fortalecen la unión de nuestra comunidad universitaria y nos permiten compartir tradiciones que dan identidad a nuestra institución.
Agradecemos la participación de todos y reconocemos el esfuerzo y creatividad reflejados en cada presentación y elaboración de piñatas.
En la UES Atenco seguimos construyendo momentos que nos unen.
Universidad Mexiquense del Bicentenario
#ComunidadColibríUMB
#OrgullosamenteUMB#TodosSomosUMB`,
    date: '2025-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop',
    category: 'Social'
  },
  {
    id: '2',
    title: 'Competencia de futbol',
    summary: 'Enhorabuena a la #ComunidadColibríUMB de la UMB UES Atenco por su participación en el Torneo de Fútbol.',
    content: `Enhorabuena a la #ComunidadColibríUMB de la UMB UES Atenco 🏫 por su participación en el Torneo de Fútbol ⚽️ (varonil y femenil) realizado con la finalidad de fortalecer la actividad deportiva y el trabajo en equipo entre la comunidad universitaria, contribuyendo a fortalecer su formación académica y personal. 

¡Somos #OrgullosamenteUMB!`,
    date: '2025-07-12',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    category: 'Sports'
  },
  {
    id: '3',
    title: 'Concurso de spelling',
    summary: 'Tercer concurso de deletreo en inglés Spelling Bee UMB. Estudiantes de diversas regiones compitieron demostrando su habilidad.',
    content: `Tercer concurso de deletreo en inglés Spelling Bee UMB (25-26/1)

El día 1° de diciembre, se llevó a cabo el Tercer concurso de deletreo en inglés "Spelling Bee UMB", en el cual participaron los estudiantes finalistas de cada un de las cinco regiones que integran la UMB.

- Región Norte: representada por Daniel Reyes Nieto, estudiante de la UES Ixtlahuaca.
- Región Valle de Toluca: representada por Armando Alcalá Gaona, estudiante de la UES Huixquilucan.
- Región Sur: representada por Kevin Kaleb Darío Torres, estudiante de la UES Almoloya de Alquisiras.
- Región Valle de México: representada por Gael Valencia Argueta, estudiante de la UES Cuautitlán.
- Región Oriente: representada por Luis Ángel Aceves Hernández, estudiante de la UES Atenco

Asimismo, se contó con la participación del jurado conformado por las docentes Karla Fernanda Fierro Aguirre, de la Ues Tejupilco, y Karen Argelia García Floriano de la UMB Tepotzotlán, así como el docente Eder Efraín Rodríguez Ramírez de la UES Tenango del Valle. De igual manera se contó con el apoyo de la Asistente de idioma inglés, Alessandra Caroline Caceres Torres, quien fungió como pronunciadora de las palabras del concurso.

Después de diversas rondas, los finalistas demostraron su talento y su habilidad para el deletreo en inglés, desempeñándose con inteligencia y destreza, obteniendo los siguientes resultados:

- Primer Lugar: Luis Ángel Aceves Hernández, estudiante de la UES Atenco

- Segundo Lugar: Daniel Reyes Nieto, estudiante de la UES Ixtlahuaca

- Tercer Lugar: Kevin Kaleb Darío Torres, estudiante de la UES Almoloya de Alquisiras

Con esta actividad se sigue impulsando el dominio del idioma inglés entre nuestra comunidad universitaria para el desarrollo de habilidades importantes, así como para la formación integral.

#OrgullosamenteUMB
#TodosSomosUMB`,
    date: '2025-01-12',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    category: 'Academic'
  }
];

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const handleEnhanceSummary = async (id: string, title: string) => {
    setLoadingAi(id);
    const newSummary = await generateNewsSummary(title);
    setNews(prev => prev.map(n => n.id === id ? { ...n, summary: newSummary } : n));
    setLoadingAi(null);
  };

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center text-pink-600 font-semibold mb-6 hover:text-pink-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Noticias
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img 
              src={selectedArticle.imageUrl} 
              alt={selectedArticle.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
               <div className="flex items-center space-x-3 text-white/90 text-sm font-medium mb-3">
                  <span className="bg-[#FF8FE9] text-white px-3 py-1 rounded-full">{selectedArticle.category}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedArticle.date}</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  {selectedArticle.title}
               </h1>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              {/* If content exists, preserve newlines, otherwise show summary */}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Noticias Universitarias</h2>
          <p className="text-slate-500 mt-2">Mantente al día con lo último del campus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-slate-100">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-pink-600 shadow-sm flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {item.category}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center text-slate-400 text-xs mb-3 space-x-2">
                <Clock className="w-3 h-3" />
                <span>{item.date}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-[#FF8FE9] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-slate-600 text-sm mb-6 flex-1 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <button 
                  onClick={() => setSelectedArticle(item)}
                  className="text-pink-600 text-sm font-semibold hover:text-pink-800 flex items-center group"
                >
                  Leer más <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => handleEnhanceSummary(item.id, item.title)}
                  disabled={loadingAi === item.id}
                  className="text-xs flex items-center bg-pink-50 text-pink-700 px-2 py-1.5 rounded-lg hover:bg-pink-100 transition-colors disabled:opacity-50"
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
    </div>
  );
};