import React, { useState } from 'react';
import { FileText, Briefcase, Users, Linkedin, CheckSquare, MessageSquare, Award, ArrowRight } from 'lucide-react';

export const CareerGuidanceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CV' | 'INTERVIEW' | 'NETWORKING'>('CV');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center">
          <Briefcase className="w-10 h-10 mr-4 text-[#FF8FE9]" />
          Orientación Laboral
        </h2>
        <p className="text-slate-500 mt-3 text-lg">Herramientas y consejos para impulsar tu carrera profesional.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => setActiveTab('CV')}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
            activeTab === 'CV'
              ? 'bg-[#FF8FE9] text-white shadow-lg ring-2 ring-[#ff76e5] ring-offset-2'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Creación de CV
        </button>
        <button
          onClick={() => setActiveTab('INTERVIEW')}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
            activeTab === 'INTERVIEW'
              ? 'bg-[#FF8FE9] text-white shadow-lg ring-2 ring-[#ff76e5] ring-offset-2'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Entrevistas de Trabajo
        </button>
        <button
          onClick={() => setActiveTab('NETWORKING')}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
            activeTab === 'NETWORKING'
              ? 'bg-[#FF8FE9] text-white shadow-lg ring-2 ring-[#ff76e5] ring-offset-2'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Linkedin className="w-4 h-4 mr-2" />
          Networking y LinkedIn
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'CV' && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
              <div className="p-8 border-b border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Estructura de un CV Ganador</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Tu Curriculum Vitae es tu primera impresión. Debe ser claro, conciso y adaptado a la vacante que buscas. Aquí te mostramos cómo estructurarlo.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">1. Datos de Contacto</h4>
                        <p className="text-sm text-slate-500">Nombre completo, teléfono, correo profesional (ej. nombre.apellido@email.com) y enlace a LinkedIn.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">2. Experiencia Profesional</h4>
                        <p className="text-sm text-slate-500">Orden cronológico inverso. Enfócate en logros y resultados, no solo en responsabilidades. Usa verbos de acción.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">3. Habilidades (Hard & Soft Skills)</h4>
                        <p className="text-sm text-slate-500">Técnicas: Java, Python, Gestión de Proyectos. Blandas: Liderazgo, Comunicación, Trabajo en Equipo.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-6">
                 <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                    <CheckSquare className="w-5 h-5 mr-2 text-green-500" /> Checklist antes de enviar:
                 </h4>
                 <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-2">
                    <li>Revisa la ortografía minuciosamente.</li>
                    <li>Guarda el archivo en formato PDF.</li>
                    <li>Nombra el archivo profesionalmente (ej. CV_JuanPerez_Ingeniero.pdf).</li>
                    <li>Asegúrate de que no exceda las 2 páginas.</li>
                 </ul>
              </div>
            </div>
          )}

          {activeTab === 'INTERVIEW' && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Domina tu Entrevista de Trabajo</h3>
                <p className="text-slate-600 mb-6">
                   La preparación es la clave del éxito. Conoce las preguntas más frecuentes y cómo responderlas utilizando el método STAR.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                    <h4 className="font-bold text-blue-800 mb-2">Método STAR para responder preguntas conductuales:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-blue-700">S - Situación:</strong> Describe el contexto.</div>
                        <div><strong className="text-blue-700">T - Tarea:</strong> ¿Cuál era tu responsabilidad?</div>
                        <div><strong className="text-blue-700">A - Acción:</strong> ¿Qué hiciste específicamente?</div>
                        <div><strong className="text-blue-700">R - Resultado:</strong> ¿Qué lograste? (Usa números).</div>
                    </div>
                </div>

                <h4 className="font-bold text-slate-800 mb-3">Preguntas Frecuentes:</h4>
                <div className="space-y-3">
                    <div className="collapse bg-slate-50 rounded-lg p-3">
                        <p className="font-medium text-slate-700">"Háblame de ti"</p>
                        <p className="text-xs text-slate-500 mt-1">No cuentes tu vida personal. Resume tu experiencia académica, tus logros profesionales y por qué te interesa este puesto.</p>
                    </div>
                    <div className="collapse bg-slate-50 rounded-lg p-3">
                        <p className="font-medium text-slate-700">"¿Cuáles son tus debilidades?"</p>
                        <p className="text-xs text-slate-500 mt-1">Menciona una debilidad real pero explica qué estás haciendo para mejorarla (ej. "A veces me cuesta delegar, pero uso herramientas de gestión para confiar más en mi equipo").</p>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NETWORKING' && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Networking y Marca Personal</h3>
                <p className="text-slate-600 mb-6">
                   Más del 70% de las vacantes no se publican, se cubren por recomendaciones. Construir una red de contactos es vital.
                </p>

                <div className="flex flex-col md:flex-row gap-6 items-center bg-[#0077b5]/10 p-6 rounded-xl border border-[#0077b5]/20 mb-6">
                    <Linkedin className="w-16 h-16 text-[#0077b5]" />
                    <div>
                        <h4 className="font-bold text-[#0077b5] text-lg">Optimiza tu LinkedIn</h4>
                        <ul className="text-sm text-slate-700 mt-2 space-y-1">
                            <li>• Usa una foto profesional (fondo neutro, buena luz).</li>
                            <li>• Personaliza tu URL (linkedin.com/in/tu-nombre).</li>
                            <li>• En el titular, pon tu cargo objetivo (ej. Estudiante de Ingeniería | Desarrollador Jr).</li>
                            <li>• Pide recomendaciones a profesores y compañeros.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-3">Tips de Networking Universitario</h4>
                    <p className="text-sm text-slate-600 mb-2">1. Asiste a ferias de empleo y conferencias de la UES.</p>
                    <p className="text-sm text-slate-600 mb-2">2. Mantén contacto con tus profesores, ellos suelen tener conexiones en la industria.</p>
                    <p className="text-sm text-slate-600">3. Únete a capítulos estudiantiles o grupos de interés.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Resources */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-xl mb-2">Recursos Descargables</h3>
                <p className="text-purple-100 text-sm mb-4">Plantillas editables para comenzar tu búsqueda.</p>
                
                <div className="space-y-3">
                    <button className="w-full bg-white/20 hover:bg-white/30 p-3 rounded-lg flex items-center transition-colors text-sm font-medium">
                        <FileText className="w-4 h-4 mr-3" /> Plantilla CV Moderno (Word)
                    </button>
                    <button className="w-full bg-white/20 hover:bg-white/30 p-3 rounded-lg flex items-center transition-colors text-sm font-medium">
                        <FileText className="w-4 h-4 mr-3" /> Plantilla CV Académico
                    </button>
                    <button className="w-full bg-white/20 hover:bg-white/30 p-3 rounded-lg flex items-center transition-colors text-sm font-medium">
                        <CheckSquare className="w-4 h-4 mr-3" /> Lista de Verbos de Acción
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Sitios de Búsqueda de Empleo</h3>
                <ul className="space-y-3">
                    <li>
                        <a href="#" className="flex items-center text-slate-600 hover:text-[#FF8FE9] transition-colors group">
                            <span className="w-2 h-2 bg-slate-300 rounded-full mr-3 group-hover:bg-[#FF8FE9]"></span>
                            LinkedIn Jobs
                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-slate-600 hover:text-[#FF8FE9] transition-colors group">
                            <span className="w-2 h-2 bg-slate-300 rounded-full mr-3 group-hover:bg-[#FF8FE9]"></span>
                            OCC Mundial
                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-slate-600 hover:text-[#FF8FE9] transition-colors group">
                            <span className="w-2 h-2 bg-slate-300 rounded-full mr-3 group-hover:bg-[#FF8FE9]"></span>
                            Indeed
                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center text-slate-600 hover:text-[#FF8FE9] transition-colors group">
                            <span className="w-2 h-2 bg-slate-300 rounded-full mr-3 group-hover:bg-[#FF8FE9]"></span>
                            Computrabajo
                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};