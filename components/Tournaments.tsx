import React from 'react';
import { Tournament } from '../types';
import { Trophy, Calendar, Users, Activity } from 'lucide-react';

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'Copa Universitaria de Fútbol',
    sport: 'Fútbol Soccer',
    status: 'Live',
    startDate: '2023-10-20',
    teams: ['Ingeniería', 'Derecho', 'Medicina', 'Arquitectura'],
    currentRound: 'Semifinales'
  },
  {
    id: 't2',
    name: 'Torneo Relámpago Voleibol',
    sport: 'Voleibol',
    status: 'Upcoming',
    startDate: '2023-11-05',
    teams: ['Lobos', 'Águilas', 'Osos', 'Tigres'],
    currentRound: 'Fase de Grupos'
  },
  {
    id: 't3',
    name: 'Campeonato de Ajedrez',
    sport: 'Ajedrez',
    status: 'Completed',
    startDate: '2023-09-15',
    teams: ['Individual'],
    currentRound: 'Finalizado'
  }
];

export const Tournaments: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Torneos Deportivos</h2>
        <p className="mt-4 text-xl text-slate-500">Sigue la acción de nuestros equipos representativos.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {MOCK_TOURNAMENTS.map((tournament) => (
          <div key={tournament.id} className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-shadow duration-300">
            {/* Header / Banner */}
            <div className={`h-32 flex items-center justify-center
              ${tournament.status === 'Live' ? 'bg-gradient-to-r from-red-400 to-[#FF8FE9]' : 
                tournament.status === 'Upcoming' ? 'bg-gradient-to-r from-[#FF8FE9] to-pink-400' : 'bg-slate-700'}
            `}>
              <Trophy className="w-16 h-16 text-white/20 absolute transform -rotate-12 left-4 top-4" />
              <div className="text-center z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black/20 backdrop-blur-md`}>
                  {tournament.status === 'Live' ? 'En Vivo' : tournament.status === 'Upcoming' ? 'Próximamente' : 'Finalizado'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{tournament.name}</h3>
              <p className="text-slate-500 font-medium mb-6">{tournament.sport}</p>

              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <Activity className="w-5 h-5 mr-3 text-[#d147a3]" />
                  <span className="font-medium text-sm">Ronda: {tournament.currentRound}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Calendar className="w-5 h-5 mr-3 text-[#d147a3]" />
                  <span className="font-medium text-sm">Inicio: {tournament.startDate}</span>
                </div>
                <div className="flex items-start text-slate-600">
                  <Users className="w-5 h-5 mr-3 text-[#d147a3] mt-0.5" />
                  <div className="text-sm">
                    <span className="font-medium block mb-1">Equipos:</span>
                    <div className="flex flex-wrap gap-1">
                      {tournament.teams.map(t => (
                        <span key={t} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full bg-slate-50 text-slate-700 font-semibold py-2 rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-[#d147a3] transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};