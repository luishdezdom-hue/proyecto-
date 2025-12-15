import React from 'react';
import { AdvisoryRegistration, LibraryReservation, JobApplication, Teacher, TeacherRating } from '../types';
import { Table, FileSpreadsheet, Star } from 'lucide-react';

interface AdminDashboardProps {
  advisories: AdvisoryRegistration[];
  libraryReservations: LibraryReservation[];
  jobApplications: JobApplication[];
  teacherRatings: TeacherRating[];
  teachers: Teacher[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  advisories, 
  libraryReservations, 
  jobApplications, 
  teacherRatings,
  teachers
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

  const TableHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-green-400 text-white px-4 py-2 font-bold text-sm flex items-center border border-green-500 mt-8 mb-0 rounded-t-lg">
      <FileSpreadsheet className="w-4 h-4 mr-2" />
      {title}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administrador</h2>
      <p className="text-slate-500 mb-8">Visualización de datos y respuestas de formularios.</p>

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
            {teachers.map((teacher, idx) => (
              <tr key={teacher.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-2 border-r font-medium">{teacher.name}</td>
                <td className="px-4 py-2 border-r text-slate-500">{teacher.department}</td>
                <td className="px-4 py-2 text-center font-bold text-yellow-600 flex justify-center items-center">
                   {calculateAverageStars(teacher.id)} <Star className="w-3 h-3 ml-1 fill-yellow-500 text-yellow-500" />
                </td>
              </tr>
            ))}
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

      {/* --- JOB OFFERS TABLE --- */}
      <TableHeader title="SOLICITUDES DE OFERTA LABORAL" />
      <div className="overflow-x-auto border-x border-b border-slate-300 bg-white mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b border-r">Fecha</th>
              <th className="px-4 py-3 border-b border-r">Carrera</th>
              <th className="px-4 py-3 border-b border-r text-center">Promedio</th>
              <th className="px-4 py-3 border-b">Características / Habilidades Registradas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {jobApplications.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-slate-400 italic">No hay solicitudes.</td></tr>
            ) : (
              jobApplications.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-2 border-r whitespace-nowrap">{item.timestamp.toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-r">{item.career}</td>
                  <td className="px-4 py-2 border-r text-center font-bold">{item.average}</td>
                  <td className="px-4 py-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {item.specs.map((spec, i) => (
                        <div key={i} className="text-xs text-slate-600 truncate bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                           {i+1}. {spec}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};