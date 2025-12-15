export enum ViewState {
  NEWS = 'NEWS',
  CALENDAR = 'CALENDAR',
  ATTENDANCE = 'ATTENDANCE',
  TEACHER_EVALUATION = 'TEACHER_EVALUATION',
  TEACHER_INFO = 'TEACHER_INFO',
  ADVISORY = 'ADVISORY',
  LIBRARY = 'LIBRARY',
  CAFETERIA = 'CAFETERIA',
  MAP = 'MAP',
  CAREER_GUIDANCE = 'CAREER_GUIDANCE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  GAMES = 'GAMES'
}

export interface User {
  id: string;
  username: string;
  password?: string; // Optional for mock/teacher
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  career?: string; // Only for students
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
  career?: string; // New: Event specific to a career
  subject?: string; // New: Event specific to a subject
  authorId?: string; // New: Who created it
}

export interface Teacher {
  id: string;
  name: string;
  department: string;
  photoUrl: string;
  career?: string;
  specialty?: string;
  studies?: string;
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
  status: 'Live' | 'Upcoming' | 'Completed';
  startDate: string;
  teams: string[];
  currentRound: string;
}

// --- Data Models for Admin Dashboard ---

export interface AdvisoryRegistration {
  id: string;
  studentName: string;
  matricula: string;
  group: string;
  subject: string;
  tutor: string;
  time: string;
  timestamp: Date;
}

export interface LibraryReservation {
  id: string;
  studentName: string;
  matricula: string;
  career: string;
  bookTitle: string;
  bookAuthor: string;
  timestamp: Date;
}

export interface JobApplication {
  id: string;
  career: string;
  average: string;
  specs: string[]; // The 6 characteristics
  timestamp: Date;
}

export interface TeacherRating {
  teacherId: string;
  ratings: Record<number, number>; // questionIndex -> rating
}