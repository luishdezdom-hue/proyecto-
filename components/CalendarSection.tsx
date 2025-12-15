import React, { useState, useMemo } from 'react';
import { UniversityEvent, AbsenceRecord, EventType } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Plus, Save, Clock } from 'lucide-react';

interface CalendarSectionProps {
  events: UniversityEvent[];
  absences: AbsenceRecord[];
  teachers: any[]; // Passed to resolve names
  onAddEvent: (event: UniversityEvent) => void;
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const getEventStyles = (type: EventType) => {
  switch (type) {
    case EventType.VACATION:
      return {
        cardBg: 'bg-blue-100',
        border: 'border-blue-500',
        text: 'text-blue-900',
        subText: 'text-blue-700',
        badge: 'bg-white/50 text-blue-800',
        dot: 'bg-blue-500',
        cellBg: 'bg-blue-50'
      };
    case EventType.EXAM:
      return {
        cardBg: 'bg-purple-100', // Lilac-ish
        border: 'border-purple-500',
        text: 'text-purple-900',
        subText: 'text-purple-700',
        badge: 'bg-white/50 text-purple-800',
        dot: 'bg-purple-500',
        cellBg: 'bg-purple-50'
      };
    default: // Green for others
      return {
        cardBg: 'bg-green-100',
        border: 'border-green-500',
        text: 'text-green-900',
        subText: 'text-green-700',
        badge: 'bg-white/50 text-green-800',
        dot: 'bg-green-500',
        cellBg: 'bg-green-50'
      };
  }
};

export const CalendarSection: React.FC<CalendarSectionProps> = ({ events, absences, teachers, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>(EventType.LECTURE);
  const [endDateStr, setEndDateStr] = useState('');

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) return;

    if (newEventType === EventType.VACATION && endDateStr) {
      // Parse end date from string (YYYY-MM-DD) to local date
      const [endYear, endMonth, endDay] = endDateStr.split('-').map(Number);
      const endDate = new Date(endYear, endMonth - 1, endDay);
      endDate.setHours(0, 0, 0, 0);

      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);

      // Create an event for each day in the range
      const loopDate = new Date(startDate);
      while (loopDate <= endDate) {
        const newEvent: UniversityEvent = {
          id: Math.random().toString(36).substr(2, 9),
          title: newEventTitle,
          location: newEventLocation,
          type: newEventType,
          date: new Date(loopDate)
        };
        onAddEvent(newEvent);
        
        // Next day
        loopDate.setDate(loopDate.getDate() + 1);
      }
    } else {
      // Single event creation
      const newEvent: UniversityEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: newEventTitle,
        location: newEventLocation,
        type: newEventType,
        date: selectedDate
      };
      onAddEvent(newEvent);
    }
    
    // Reset form
    setNewEventTitle('');
    setNewEventLocation('');
    setEndDateStr('');
  };

  // Determine items for selected date
  const selectedDateEvents = useMemo(() => {
    return events.filter(e => 
      new Date(e.date).toDateString() === selectedDate.toDateString()
    );
  }, [events, selectedDate]);

  // Optimize event lookup for the month
  const getDayEvents = (day: number) => {
    const checkDateStr = new Date(year, month, day).toDateString();
    return events.filter(e => new Date(e.date).toDateString() === checkDateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-14 md:h-24 bg-slate-50/50"></div>);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = getDayEvents(d);
      const dayAbsences = absences.filter(a => new Date(a.date).toDateString() === new Date(year, month, d).toDateString());
      
      const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      // Determine background color based on event type priority
      let bgClass = 'bg-white';
      if (dayEvents.some(e => e.type === EventType.EXAM)) {
        bgClass = getEventStyles(EventType.EXAM).cellBg;
      } else if (dayEvents.some(e => e.type === EventType.VACATION)) {
        bgClass = getEventStyles(EventType.VACATION).cellBg;
      } else if (dayEvents.length > 0) {
        // Just pick the first one or default green
        bgClass = getEventStyles(dayEvents[0].type).cellBg;
      }

      // Selection overrides background lightly or adds border
      const containerClass = isSelected 
        ? `bg-pink-50 ring-2 ring-[#FF8FE9] ring-inset z-10` 
        : `${bgClass} border border-slate-100 hover:brightness-95`;

      days.push(
        <button
          key={d}
          onClick={() => setSelectedDate(new Date(year, month, d))}
          className={`h-10 sm:h-14 md:h-24 relative flex flex-col items-start justify-start p-1 transition-all duration-200 ${containerClass}`}
        >
          <span className={`text-xs sm:text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
            ${isToday ? 'bg-[#FF8FE9] text-white' : 'text-slate-700'}
          `}>
            {d}
          </span>
          <div className="flex gap-1 flex-wrap content-start w-full px-1">
            {dayEvents.slice(0, 4).map((ev, i) => (
               <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getEventStyles(ev.type).dot}`} title={ev.title}></div>
            ))}
            {dayEvents.length > 4 && <span className="text-[10px] text-slate-400 leading-none">+</span>}
            {dayAbsences.length > 0 && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400" title="Profesor Ausente"></div>}
          </div>
        </button>
      );
    }
    return days;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Calendar Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 capitalize">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-pink-100 text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-pink-100 text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {DAYS.map(day => (
              <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> Otros Eventos</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div> Vacaciones</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div> Examen</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div> Maestro Ausente</div>
        </div>
      </div>

      {/* Daily Details & Add Event Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg border border-slate-100 p-6 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 capitalize">
          {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>

        {/* Existing Events List */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-[#d147a3] uppercase tracking-wide mb-3 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" /> Agenda del Día
          </h4>
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No hay eventos programados para hoy.</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map(event => {
                const styles = getEventStyles(event.type);
                return (
                  <div key={event.id} className={`p-3 rounded-lg border-l-4 ${styles.cardBg} ${styles.border}`}>
                    <p className={`font-semibold text-sm ${styles.text}`}>{event.title}</p>
                    <p className={`text-xs mt-1 flex items-center ${styles.subText}`}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location || 'Campus Central'}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block font-medium ${styles.badge}`}>
                      {event.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add New Event Form */}
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Agregar a mi Agenda
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Título del Evento</label>
              <input 
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Ej. Vacaciones de Invierno"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8FE9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Ubicación (Opcional)</label>
              <input 
                type="text"
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                placeholder="Ej. Casa"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8FE9]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
              <select 
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8FE9]"
              >
                <option value={EventType.LECTURE}>Clase</option>
                <option value={EventType.EXAM}>Examen</option>
                <option value={EventType.WORKSHOP}>Taller</option>
                <option value={EventType.SPORTS}>Deporte</option>
                <option value={EventType.HOLIDAY}>Festivo</option>
                <option value={EventType.VACATION}>Vacaciones</option>
              </select>
            </div>

            {newEventType === EventType.VACATION && (
              <div className="animate-fade-in bg-pink-50 p-3 rounded-lg border border-pink-100">
                <label className="block text-xs font-medium text-pink-700 mb-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Fecha de Fin
                </label>
                <input 
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  min={selectedDate.toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8FE9] bg-white"
                />
                <p className="text-[10px] text-pink-600 mt-1">
                  Se marcarán todos los días desde el {selectedDate.toLocaleDateString()} hasta la fecha seleccionada.
                </p>
              </div>
            )}

            <button 
              onClick={handleCreateEvent}
              disabled={!newEventTitle.trim() || (newEventType === EventType.VACATION && !endDateStr)}
              className="w-full bg-[#FF8FE9] text-white font-medium py-2 rounded-lg hover:bg-[#ff76e5] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Evento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};