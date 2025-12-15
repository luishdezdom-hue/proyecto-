import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { generateNewsSummary } from '../services/geminiService';
import { Sparkles, ArrowRight, ArrowLeft, Clock, Tag, Globe, GraduationCap } from 'lucide-react';

const MOCK_INTERNAL_NEWS: NewsItem[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop',
    category: 'Academic'
  }
];

const MOCK_EXTERNAL_NEWS: NewsItem[] = [
  {
    id: 'ext-1',
    title: 'Bloqueo de carretera',
    summary: 'Bloqueo total en la carretera federal Texcoco-Lechería por manifestación. Tome vías alternas.',
    content: `Atención comunidad:

Se reporta un bloqueo total en la carretera federal Texcoco-Lechería a la altura del kilómetro 25, debido a una manifestación de pobladores locales.

El tránsito se encuentra detenido en ambos sentidos. Se recomienda utilizar la autopista Peñón-Texcoco o vías alternas por zonas urbanas para llegar a tiempo a sus destinos.

Autoridades estiman que el bloqueo podría mantenerse durante varias horas. Se otorgará tolerancia en el ingreso a clases para alumnos y docentes afectados.`,
    date: '2025-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1547638375-ebf04735d792?q=80&w=800&auto=format&fit=crop',
    category: 'Campus'
  },
  {
    id: 'ext-2',
    title: 'No hay paso en las vias del tren',
    summary: 'Mantenimiento urgente en el cruce ferroviario principal. Acceso restringido por 48 horas.',
    content: `Aviso Importante:

Debido a trabajos de mantenimiento urgente por parte de la empresa ferroviaria, el cruce de las vías del tren que da acceso a la zona norte del municipio permanecerá cerrado.

No habrá paso para vehículos ni peatones durante las próximas 48 horas. Se ha habilitado un desvío provisional a 500 metros.

Por favor, anticipe sus tiempos de traslado para evitar retrasos.`,
    date: '2025-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=800&auto=format&fit=crop',
    category: 'Campus'
  }
];

export const NewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');
  const [internalNews, setInternalNews] = useState<NewsItem[]>(MOCK_INTERNAL_NEWS);
  const [externalNews, setExternalNews] = useState<NewsItem[]>(MOCK_EXTERNAL_NEWS);
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const handleEnhanceSummary = async (id: string, title: string) => {
    setLoadingAi(id);
    const newSummary = await generateNewsSummary(title);
    
    if (activeTab === 'INTERNAL') {
        setInternalNews(prev => prev.map(n => n.id === id ? { ...n, summary: newSummary } : n));
    } else {
        setExternalNews(prev => prev.map(n => n.id === id ? { ...n, summary: newSummary } : n));
    }
    
    setLoadingAi(null);
  };

  const currentNews = activeTab === 'INTERNAL' ? internalNews : externalNews;

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
          <h2 className="text-3xl font-bold text-slate-900">Noticias y Avisos</h2>
          <p className="text-slate-500 mt-2">Mantente informado de lo que sucede dentro y fuera del campus.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('INTERNAL')}
          className={`pb-3 px-1 text-sm font-bold transition-all flex items-center relative ${
            activeTab === 'INTERNAL'
              ? 'text-[#FF8FE9]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Noticias Universitarias
          {activeTab === 'INTERNAL' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF8FE9] rounded-t-full"></span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('EXTERNAL')}
          className={`pb-3 px-1 text-sm font-bold transition-all flex items-center relative ${
            activeTab === 'EXTERNAL'
              ? 'text-[#FF8FE9]'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Globe className="w-5 h-5 mr-2" />
          Noticias Externas
          {activeTab === 'EXTERNAL' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF8FE9] rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
        {currentNews.map((item) => (
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