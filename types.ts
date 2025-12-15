export enum ViewState {
  NEWS = 'NEWS',
  CALENDAR = 'CALENDAR',
  ATTENDANCE = 'ATTENDANCE',
  TEACHER_EVALUATION = 'TEACHER_EVALUATION',
  TOURNAMENTS = 'TOURNAMENTS'
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  imageUrl: string;
  category: 'Academic' | 'Sports' | 'Social' | 'Campus';
}

export enum EventType {
  LECTURE = 'LECTURE',
  EXAM = 'EXAM',
  HOLIDAY = 'HOLIDAY',
  WORKSHOP = 'WORKSHOP',
  SPORTS = 'SPORTS',
  VACATION = 'VACATION'
}

export interface UniversityEvent {
  id: string;
  title: string;
  date: Date; // ISO String or Date object
  type: EventType;
  location?: string;
}

export interface Teacher {
  id: string;
  name: string;
  department: string;
  photoUrl: string;
}

export interface AbsenceRecord {
  id: string;
  teacherId: string;
  date: Date;
  reason?: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  startDate: string;
  teams: string[];
  currentRound: string;
}