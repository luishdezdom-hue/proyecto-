import React, { useState } from 'react';
import { FileText, Briefcase, Users, Linkedin, CheckSquare, MessageSquare, Award, ArrowRight, Download, Eye, X, Search, GraduationCap, Building, CheckCircle2 } from 'lucide-react';
import { JobApplication } from '../types';

const MODERN_CV_TEMPLATE = `NOMBRE COMPLETO
Ciudad, Estado | Teléfono | Correo Electrónico | LinkedIn URL | Portafolio URL

PERFIL PROFESIONAL
[Breve descripción de 3-4 líneas. Ejemplo: Estudiante de Ingeniería Industrial apasionado por la optimización de procesos. Experiencia académica en metodologías Lean y gestión de proyectos. Busco una oportunidad para aplicar mis habilidades analíticas en un entorno de manufactura.]

EDUCACIÓN
Universidad Mexiquense del Bicentenario | Atenco, Edo. Méx.
Licenciatura/Ingeniería en [Nombre de la Carrera] | [Mes Año Inicio] – [Mes Año Fin/Presente]
- Promedio General: 9.5
- Mención Honorífica por desempeño académico (si aplica).
- Proyectos relevantes: [Menciona 1 o 2 proyectos capstone o tesis].

EXPERIENCIA PROFESIONAL (O PROYECTOS ACADÉMICOS RELEVANTES)
Nombre de la Empresa / Organización | Ciudad
Cargo / Rol | [Mes Año] – [Mes Año]
- Verbo de acción + Tarea realizada + Resultado obtenido (con métricas).
- Lideré un equipo de 5 personas para el proyecto final de logística, reduciendo el tiempo de simulación en un 20%.
- Diseñé una base de datos en SQL para gestionar el inventario de la cafetería escolar.

HABILIDADES TÉCNICAS
- Software: Microsoft Excel (Avanzado), AutoCAD, Python (Básico).
- Idiomas: Español (Nativo), Inglés (B2 - Intermedio Avanzado).

HABILIDADES BLANDAS
- Liderazgo, Comunicación Efectiva, Resolución de Problemas, Adaptabilidad.

CURSOS Y CERTIFICACIONES
- Nombre del Curso | Institución emisora | Fecha
`;

const ACADEMIC_CV_TEMPLATE = `NOMBRE COMPLETO
Dirección Institucional o Personal
Teléfono | Correo Electrónico
ORCID ID | ResearchGate Link

INTERESES DE INVESTIGACIÓN
[Lista de áreas. Ej: Inteligencia Artificial, Derecho Constitucional, Manufactura Esbelta]

FORMACIÓN ACADÉMICA
Licenciatura/Ingeniería en [Nombre]
Universidad Mexiquense del Bicentenario, Atenco
[Fecha de Inicio] – [Fecha de Término]
- Tesis: "[Título de la Tesis]"
- Asesor: [Nombre del Asesor]

DISTINCIONES Y PREMIOS
- [Nombre del Premio], [Institución que otorga], [Año]
- Beca de Excelencia Académica, [Año]

EXPERIENCIA DE INVESTIGACIÓN
Ayudante de Investigación
Departamento de [Nombre], UMB Atenco | [Fechas]
- Asistencia en la recolección de datos para el proyecto [Nombre].
- Análisis estadístico utilizando SPSS.

PUBLICACIONES (SI APLICA)
- Apellido, N. (Año). Título del artículo. Nombre de la Revista, Vol(Num), pp-pp.

CONFERENCIAS Y PONENCIAS
- "Título de la Ponencia". Nombre del Evento, Lugar. [Fecha].

IDIOMAS
- Español: Nativo
- Inglés: [Nivel, ej. TOEFL 550]
`;

const VERBS_LIST = `LISTA DE VERBOS DE ACCIÓN PARA TU CV
Usa estos verbos al inicio de tus viñetas (bullet points) para describir tus logros.

LIDERAZGO Y GESTIÓN
- Administré
- Coordiné
- Dirigí
- Supervisé
- Lideré
- Planifiqué
- Delegué
- Motive

COMUNICACIÓN
- Negocié
- Presenté
- Redacté
- Expuse
- Traduje
- Informé
- Convencí
- Moderé

LOGROS Y RESULTADOS
- Incrementé (ej. las ventas, la eficiencia)
- Reduje (ej. costos, tiempos, desperdicios)
- Optimicé
- Maximicé
- Generé
- Aceleré
- Resolví

ANÁLISIS Y TÉCNICA
- Desarrollé
- Programé
- Diseñé
- Calculé
- Evalué
- Diagnostiqué
- Implementé
`;

type CareerType = "Ingeniería en TIC'S" | "Ingeniería Industrial" | "Licenciatura en Derecho";

const CAREER_SPECS: Record<CareerType, string[]> = {
    "Ingeniería en TIC'S": [
        "Nivel de Inglés Técnico",
        "Lenguajes de Programación Domiandos",
        "Experiencia en Bases de Datos",
        "Frameworks (React, Angular, etc.)",
        "Conocimientos de Cloud/DevOps",
        "Link a Portafolio/GitHub"
    ],
    "Ingeniería Industrial": [
        "Nivel de Inglés",
        "Certificaciones (Six Sigma/ISO)",
        "Software CAD/Simulación",
        "Experiencia en Logística/Almacén",
        "Conocimientos de Seguridad Industrial",
        "Manejo de ERPs (SAP, Oracle)"
    ],
    "Licenciatura en Derecho": [
        "Nivel de Inglés Legal",
        "Rama de Especialización",
        "Experiencia en Juicios Orales",
        "Redacción Jurídica",
        "Conocimiento de Reformas 2024",
        "Prácticas en Juzgados/Despachos"
    ]
};

interface CareerGuidanceSectionProps {
    onSubmitJobSearch?: (data: Omit<JobApplication, 'id' | 'timestamp'>) => void;
}

export const CareerGuidanceSection: React.FC<CareerGuidanceSectionProps> = ({ onSubmitJobSearch }) => {
  const [activeTab, setActiveTab] = useState<'CV' | 'INTERVIEW' | 'JOB_OFFER'>('CV');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentExample, setCurrentExample] = useState<{title: string, content: React.ReactNode} | null>(null);

  // Job Offer Form State
  const [jobForm, setJobForm] = useState({
      career: '' as CareerType | '',
      average: '',
      specs: ['', '', '', '', '', '']
  });
  const [showJobResult, setShowJobResult] = useState(false);

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openExample = (type: 'MODERN' | 'ACADEMIC' | 'VERBS') => {
    let content;
    let title;

    if (type === 'MODERN') {
        title = "Ejemplo: CV Moderno (Estudiante de Sistemas)";
        content = (
            <div className="bg-white p-6 shadow-sm border border-slate-200 text-sm font-sans text-slate-700">
                <div className="border-b-2 border-slate-800 pb-4 mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">Luis Ángel Aceves</h1>
                    <p className="text-slate-500 mt-1">Atenco, Mex. | 55-1234-5678 | luis.aceves@email.com</p>
                </div>
                
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-300 mb-2 uppercase text-xs">Perfil</h3>
                    <p>Estudiante de Ingeniería en TIC'S con enfoque en desarrollo web y bases de datos. Ganador del concurso regional de Spelling Bee. Busco prácticas profesionales para aplicar conocimientos en React y Node.js.</p>
                </div>

                <div className="mb-4">
                    <h3 className="font-bold text-slate-800 border-b border-slate-300 mb-2 uppercase text-xs">Proyectos Académicos</h3>
                    <div className="mb-2">
                        <div className="flex justify-between font-bold">
                            <span>Sistema de Gestión Escolar (Proyecto Final)</span>
                            <span>Ene 2024</span>
                        </div>
                        <ul className="list-disc list-inside pl-2 text-slate-600">
                            <li><strong>Desarrollé</strong> una aplicación web completa usando React y Firebase.</li>
                            <li><strong>Automaticé</strong> el registro de asistencia reduciendo el uso de papel en un 100%.</li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-bold text-slate-800 border-b border-slate-300 mb-2 uppercase text-xs">Skills Técnicos</h3>
                        <ul className="list-disc list-inside text-xs">
                            <li>JavaScript (ES6+)</li>
                            <li>React.js</li>
                            <li>SQL / MySQL</li>
                            <li>Git / GitHub</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 border-b border-slate-300 mb-2 uppercase text-xs">Idiomas</h3>
                        <ul className="list-disc list-inside text-xs">
                            <li>Español (Nativo)</li>
                            <li>Inglés (B2 - Avanzado)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else if (type === 'ACADEMIC') {
        title = "Ejemplo: CV Académico (Investigación)";
        content = (
            <div className="bg-white p-8 shadow-sm border border-slate-200 text-sm font-serif text-slate-800">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold">Ana María Torres</h1>
                    <p>Departamento de Ingeniería Industrial, UMB Atenco</p>
                    <p>ana.torres@umb.edu.mx</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-bold uppercase border-b border-black mb-2">Intereses de Investigación</h4>
                    <p>Optimización de Cadenas de Suministro, Logística Verde, Investigación de Operaciones.</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-bold uppercase border-b border-black mb-2">Educación</h4>
                    <p><strong>Ingeniería Industrial</strong>, UMB Atenco (2020 - Presente)</p>
                    <p className="pl-4 italic">- Promedio acumulado: 9.8/10</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-bold uppercase border-b border-black mb-2">Publicaciones</h4>
                    <p className="pl-4 text-xs">Torres, A., & Martinez, Y. (2023). <em>Análisis de rutas críticas en transporte local</em>. Revista de Ingeniería UMB, 4(2), 45-50.</p>
                </div>
            </div>
        );
    } else {
        title = "Guía: Cómo usar Verbos de Acción";
        content = (
            <div className="bg-white p-6 shadow-sm border border-slate-200 text-sm">
                <p className="mb-4 text-slate-600">No describas solo tus responsabilidades ("Encargado de..."). Describe lo que lograste.</p>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded border border-red-100">
                            <h5 className="font-bold text-red-700 flex items-center mb-2"><X className="w-4 h-4 mr-2" /> Forma Incorrecta (Pasiva)</h5>
                            <ul className="list-disc list-inside text-slate-600 space-y-2">
                                <li>"Hacía reportes de ventas."</li>
                                <li>"Estaba a cargo del equipo."</li>
                                <li>"Ayudé a organizar el evento."</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded border border-green-100">
                            <h5 className="font-bold text-green-700 flex items-center mb-2"><CheckSquare className="w-4 h-4 mr-2" /> Forma Correcta (Activa)</h5>
                            <ul className="list-disc list-inside text-slate-800 space-y-2">
                                <li>"<strong>Redacté</strong> reportes semanales de ventas para la gerencia."</li>
                                <li>"<strong>Supervisé</strong> un equipo de 4 personas."</li>
                                <li>"<strong>Coordiné</strong> la logística del evento anual para 200 asistentes."</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    setCurrentExample({ title, content });
    setModalOpen(true);
  };

  const handleSpecChange = (index: number, value: string) => {
      const newSpecs = [...jobForm.specs];
      newSpecs[index] = value;
      setJobForm({...jobForm, specs: newSpecs});
  };

  const handleSearchJobs = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (onSubmitJobSearch && jobForm.career) {
          onSubmitJobSearch({
              career: jobForm.career,
              average: jobForm.average,
              specs: jobForm.specs
          });
      }

      setShowJobResult(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Example Modal */}
      {modalOpen && currentExample && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        {currentExample.title}
                    </h3>
                    <button onClick={() => setModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {currentExample.content}
                </div>
                <div className="p-4 bg-white border-t border-slate-200 text-right">
                    <button onClick={() => setModalOpen(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg font-medium transition-colors">
                        Cerrar Ejemplo
                    </button>
                </div>
            </div>
        </div>
      )}

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
          onClick={() => setActiveTab('JOB_OFFER')}
          className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
            activeTab === 'JOB_OFFER'
              ? 'bg-[#FF8FE9] text-white shadow-lg ring-2 ring-[#ff76e5] ring-offset-2'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Search className="w-4 h-4 mr-2" />
          Oferta Laboral
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

          {activeTab === 'JOB_OFFER' && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Encuentra tu Práctica u Oferta Ideal</h3>
                <p className="text-slate-600 mb-6 text-sm">
                   Completa tu perfil académico para encontrar vacantes adaptadas a tus habilidades.
                </p>

                {!showJobResult ? (
                    <form onSubmit={handleSearchJobs} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Carrera</label>
                                <select 
                                    required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8FE9] bg-white"
                                    value={jobForm.career}
                                    onChange={(e) => {
                                        setJobForm({
                                            ...jobForm, 
                                            career: e.target.value as CareerType,
                                            specs: ['', '', '', '', '', '']
                                        });
                                    }}
                                >
                                    <option value="">Selecciona tu carrera...</option>
                                    <option value="Ingeniería en TIC'S">Ingeniería en TIC'S</option>
                                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                                    <option value="Licenciatura en Derecho">Licenciatura en Derecho</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Promedio Final</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    min="0" 
                                    max="10"
                                    required
                                    placeholder="Ej. 9.2"
                                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF8FE9]"
                                    value={jobForm.average}
                                    onChange={(e) => setJobForm({...jobForm, average: e.target.value})}
                                />
                            </div>
                        </div>

                        {jobForm.career && (
                            <div className="animate-fade-in bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
                                <h4 className="font-bold text-slate-700 mb-4 flex items-center">
                                    <GraduationCap className="w-5 h-5 mr-2 text-[#FF8FE9]" />
                                    Características Específicas: {jobForm.career}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {CAREER_SPECS[jobForm.career].map((label, idx) => (
                                        <div key={idx}>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
                                            <input 
                                                type="text" 
                                                required
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF8FE9]"
                                                value={jobForm.specs[idx]}
                                                onChange={(e) => handleSpecChange(idx, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                             <button 
                                type="submit"
                                disabled={!jobForm.career || !jobForm.average}
                                className="w-full bg-[#FF8FE9] hover:bg-[#ff76e5] text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                             >
                                <Search className="w-5 h-5 mr-2" />
                                Buscar Ofertas Compatibles
                             </button>
                        </div>
                    </form>
                ) : (
                    <div className="animate-scale-up">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center text-green-800">
                             <CheckCircle2 className="w-6 h-6 mr-3" />
                             <div>
                                 <p className="font-bold">Perfil Analizado Exitosamente</p>
                                 <p className="text-xs">Basado en tu promedio de {jobForm.average} y habilidades.</p>
                             </div>
                             <button onClick={() => setShowJobResult(false)} className="ml-auto text-sm underline font-medium hover:text-green-900">Modificar búsqueda</button>
                        </div>

                        <h4 className="font-bold text-slate-800 mb-4">Mejor coincidencia encontrada:</h4>
                        
                        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-[#FF8FE9] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">98% Match</div>
                            
                            <div className="flex items-start mb-4">
                                <div className="bg-slate-100 p-3 rounded-lg mr-4">
                                    <Building className="w-8 h-8 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#d147a3] transition-colors">
                                        {jobForm.career === "Ingeniería en TIC'S" ? "Desarrollador Full Stack Jr." :
                                         jobForm.career === "Ingeniería Industrial" ? "Ingeniero de Procesos Jr." :
                                         "Abogado Corporativo Jr."}
                                    </h3>
                                    <p className="text-slate-500 text-sm">TechCorp Solutions | Ciudad de México (Híbrido)</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-slate-600">
                                    <CheckSquare className="w-4 h-4 mr-2 text-green-500" />
                                    <span>Requisito Promedio: 8.5+ (Tu: {jobForm.average})</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <CheckSquare className="w-4 h-4 mr-2 text-green-500" />
                                    <span>Inglés: {jobForm.specs[0]} (Requerido: Intermedio)</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <CheckSquare className="w-4 h-4 mr-2 text-green-500" />
                                    <span>Habilidad Clave: {jobForm.specs[2]}</span>
                                </div>
                            </div>

                            <button className="w-full border-2 border-[#FF8FE9] text-[#d147a3] font-bold py-2 rounded-lg hover:bg-[#FF8FE9] hover:text-white transition-colors">
                                Aplicar Ahora
                            </button>
                        </div>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Resources */}
        <div className="space-y-6">
            {activeTab !== 'JOB_OFFER' && (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg sticky top-24">
                <h3 className="font-bold text-xl mb-2">Recursos Descargables</h3>
                <p className="text-purple-100 text-sm mb-4">Plantillas editables (.txt) para comenzar.</p>
                
                <div className="space-y-4">
                    {/* Modern CV */}
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <div className="flex items-center text-sm font-bold mb-2">
                            <FileText className="w-4 h-4 mr-2" /> Plantilla CV Moderno
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => downloadFile('Plantilla_CV_Moderno.txt', MODERN_CV_TEMPLATE)}
                                className="flex-1 bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors"
                             >
                                <Download className="w-3 h-3 mr-1" /> Descargar
                             </button>
                             <button 
                                onClick={() => openExample('MODERN')}
                                className="flex-1 bg-purple-800/50 hover:bg-purple-800 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors"
                             >
                                <Eye className="w-3 h-3 mr-1" /> Ejemplo
                             </button>
                        </div>
                    </div>

                    {/* Academic CV */}
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <div className="flex items-center text-sm font-bold mb-2">
                            <FileText className="w-4 h-4 mr-2" /> Plantilla CV Académico
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => downloadFile('Plantilla_CV_Academico.txt', ACADEMIC_CV_TEMPLATE)}
                                className="flex-1 bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors"
                             >
                                <Download className="w-3 h-3 mr-1" /> Descargar
                             </button>
                             <button 
                                onClick={() => openExample('ACADEMIC')}
                                className="flex-1 bg-purple-800/50 hover:bg-purple-800 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors"
                             >
                                <Eye className="w-3 h-3 mr-1" /> Ejemplo
                             </button>
                        </div>
                    </div>

                    {/* Verbs List */}
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                        <div className="flex items-center text-sm font-bold mb-2">
                            <CheckSquare className="w-4 h-4 mr-2" /> Verbos de Acción
                        </div>
                         <div className="flex gap-2">
                             <button 
                                onClick={() => downloadFile('Lista_Verbos_Accion.txt', VERBS_LIST)}
                                className="flex-1 bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors"
                             >
                                <Download className="w-3 h-3 mr-1" /> Descargar
                             </button>
                             <button 
                                onClick={() => openExample('VERBS')}
                                className="flex-1 bg-purple-800/50 hover:bg-purple-800 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center transition-colors"
                             >
                                <Eye className="w-3 h-3 mr-1" /> Tips
                             </button>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};
