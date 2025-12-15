import React from 'react';
import { AdvisoryRegistration, LibraryReservation, JobApplication, Teacher, TeacherRating, User } from '../types';
import { Table, FileSpreadsheet, Star, Users, Settings, ToggleLeft, ToggleRight, Layout } from 'lucide-react';

interface AdminDashboardProps {
  advisories: AdvisoryRegistration[];
  libraryReservations: LibraryReservation[];
  jobApplications: JobApplication[];
  teacherRatings: TeacherRating[];
  teachers: Teacher[];
  registeredUsers?: User[];
  enabledSections?: Record<string, boolean>;
  onToggleSection?: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  advisories, 
  libraryReservations, 
  jobApplications, 
  teacherRatings,
  teachers,
  registeredUsers = [],
  enabledSections = {},
  onToggleSection
}) => {

  const calculateAverageStars = (teacherId: string) => {
    const ratings = teacherRatings.filter(r => r.teacherId === teacherId);
    if (ratings.length === 0) return "S/C";

    let totalStars = 0;
    let totalQuestions = 0;

    ratings.forEach(r => {
      const values = Object.values(r.ratings);
      totalStars += values.reduce((a, b) => a + b, 0);
      totalQuestions += values.length;
    });

    if (totalQuestions === 0) return "S/C";
    return (totalStars / totalQuestions).toFixed(1);
  };

  const TableHeader: React.FC<{ title: string, icon?: React.ReactNode }> = ({ title, icon }) => (
    <div className="bg-green-400 text-white px-4 py-2 font-bold text-sm flex items-center border border-green-500 mt-8 mb-0 rounded-t-lg">
      {icon || <FileSpreadsheet className="w-4 h-4 mr-2" />}
      <span className="ml-2">{title}</span>
    </div>
  );

  // Group teachers by career
  const careers = ["Ingeniería en TIC'S", "Ingeniería Industrial", "Licenciatura en Derecho"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administrador</h2>
      <p className="text-slate-500 mb-8">Visualización de datos y gestión de la plataforma.</p>

      {/* --- MODULE MANAGEMENT SECTION --- */}
      {onToggleSection && (
        <div className="mb-12">
          <TableHeader title="GESTIÓN DE MÓDULOS DEL SISTEMA" icon={<Settings className="w-4 h-4" />} />
          <div className="bg-white border-x border-b border-slate-300 p-6 rounded-b-lg shadow-sm">
            <p className="text-sm text-slate-500 mb-4">Activa o desactiva las secciones visibles para alumnos y docentes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(enabledSections).map(([key, isEnabled]) => (
                <div key={key} className={`flex items-center justify-between p-3 rounded-lg border ${isEnabled ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center">
                    <Layout className={`w-4 h-4 mr-2 ${isEnabled ? 'text-green-600' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${isEnabled ? 'text-slate-800' : 'text-slate-500'}`}>
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <button 
                    onClick={() => onToggleSection(key)}
                    className={`focus:outline-none transition-colors ${isEnabled ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {isEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- USERS DATABASE TABLE --- */}
      <TableHeader title="BASE DE DATOS DE ALUMNOS REGISTRADOS" icon={<Users className="w-4 h-4" />} />
      <div className="overflow-x-auto border-x border-b border-slate-300 bg-white mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b border-r">Usuario</th>
              <th className="px-4 py-3 border-b border-r">Nombre</th>
              <th className="px-4 py-3 border-b border-r">Carrera</th>
              <th className="px-4 py-3 border-b">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {registeredUsers.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-slate-400 italic">No hay alumnos registrados.</td></tr>
            ) : (
              registeredUsers.map((user, idx) => (
                <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-2 border-r font-mono">{user.username}</td>
                  <td className="px-4 py-2 border-r">{user.name}</td>
                  <td className="px-4 py-2 border-r">{user.career}</td>
                  <td className="px-4 py-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{user.role}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- TEACHER RATINGS TABLE --- */}
      <TableHeader title="PROMEDIO DE EVALUACIÓN DOCENTE" />
      <div className="overflow-x-auto border-x border-b border-slate-300 bg-white mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b border-r">Docente</th>
              <th className="px-4 py-3 border-b border-r">Departamento</th>
              <th className="px-4 py-3 border-b text-center">Promedio (Estrellas)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {careers.map((career) => {
              const careerTeachers = teachers.filter(t => t.career === career);
              if (careerTeachers.length === 0) return null;

              return (
                <React.Fragment key={career}>
                  {/* Career Divider Row */}
                  <tr className="bg-green-50 border-y border-green-200">
                    <td colSpan={3} className="px-4 py-2 font-bold text-green-800 text-xs uppercase tracking-wider">
                      {career}
                    </td>
                  </tr>
                  
                  {/* Teachers for this career */}
                  {careerTeachers.map((teacher, idx) => (
                    <tr key={teacher.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 border-r font-medium border-b border-slate-100">{teacher.name}</td>
                      <td className="px-4 py-3 border-r text-slate-500 border-b border-slate-100">{teacher.department}</td>
                      <td className="px-4 py-3 text-center font-bold text-yellow-600 flex justify-center items-center border-b border-slate-100">
                        {calculateAverageStars(teacher.id)} <Star className="w-3 h-3 ml-1 fill-yellow-500 text-yellow-500" />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- ADVISORY TABLE --- */}
      <TableHeader title="REGISTRO DE ASESORÍAS ACADÉMICAS" />
      <div className="overflow-x-auto border-x border-b border-slate-300 bg-white mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b border-r">Fecha Registro</th>
              <th className="px-4 py-3 border-b border-r">Alumno</th>
              <th className="px-4 py-3 border-b border-r">Matrícula</th>
              <th className="px-4 py-3 border-b border-r">Grupo</th>
              <th className="px-4 py-3 border-b border-r">Materia</th>
              <th className="px-4 py-3 border-b border-r">Tutor</th>
              <th className="px-4 py-3 border-b">Horario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {advisories.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center text-slate-400 italic">No hay registros.</td></tr>
            ) : (
              advisories.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-2 border-r whitespace-nowrap">{item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}</td>
                  <td className="px-4 py-2 border-r">{item.studentName}</td>
                  <td className="px-4 py-2 border-r font-mono">{item.matricula}</td>
                  <td className="px-4 py-2 border-r">{item.group}</td>
                  <td className="px-4 py-2 border-r">{item.subject}</td>
                  <td className="px-4 py-2 border-r">{item.tutor}</td>
                  <td className="px-4 py-2">{item.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- LIBRARY TABLE --- */}
      <TableHeader title="RESERVAS DE BIBLIOTECA" />
      <div className="overflow-x-auto border-x border-b border-slate-300 bg-white mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b border-r">Fecha Reserva</th>
              <th className="px-4 py-3 border-b border-r">Alumno</th>
              <th className="px-4 py-3 border-b border-r">Matrícula</th>
              <th className="px-4 py-3 border-b border-r">Carrera</th>
              <th className="px-4 py-3 border-b border-r">Libro</th>
              <th className="px-4 py-3 border-b">Autor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {libraryReservations.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-slate-400 italic">No hay reservas.</td></tr>
            ) : (
              libraryReservations.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-2 border-r whitespace-nowrap">{item.timestamp.toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-r">{item.studentName}</td>
                  <td className="px-4 py-2 border-r font-mono">{item.matricula}</td>
                  <td className="px-4 py-2 border-r">{item.career}</td>
                  <td className="px-4 py-2 border-r font-medium">{item.bookTitle}</td>
                  <td className="px-4 py-2">{item.bookAuthor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};