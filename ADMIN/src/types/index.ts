export type RitualType = 'hajj' | 'umrah';
export type RitualTypeWithBoth = 'hajj' | 'umrah' | 'both';
export type DuaCategory = 'talbiyah' | 'dua' | 'dhikr';
export type AudioType = 'talbiyah' | 'dua' | 'dhikr';

export interface MediaAsset {
  url: string;
  key?: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size?: number;
  kind: 'image' | 'audio' | 'video' | 'file';
}

export interface MultiLangText {
  arabic: string;
  malayalam: string;
}

export interface RitualStep {
  _id: string;
  ritualType: RitualType;
  stepNumber: number;
  title: MultiLangText;
  description: MultiLangText;
  instructions: MultiLangText[];
  referenceLink?: string;
  attachment?: MediaAsset | null;
  videoLink?: string;
  video?: MediaAsset | null;
  isHighlighted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dua {
  _id: string;
  ritualType: RitualTypeWithBoth;
  ritualStep: string | RitualStep | null;
  title: MultiLangText;
  arabicText: string;
  malayalamMeaning: string;
  transliteration: string;
  category: DuaCategory;
  hasAudio: boolean;
  audioUrl: string;
  referenceLink?: string;
  attachment?: MediaAsset | null;
  isHighlighted: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudioFile {
  _id: string;
  title: string;
  type: AudioType;
  duaReference: string | Dua | null;
  filename: string;
  storageKey?: string;
  url: string;
  referenceLink?: string;
  attachment?: MediaAsset | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRitualSteps: number;
  hajjSteps: number;
  umrahSteps: number;
  highlightedSteps: number;
  totalDuas: number;
  hajjDuas: number;
  umrahDuas: number;
  bothDuas: number;
  highlightedDuas: number;
  totalAudio: number;
  activeAudio: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AppSettings {
  highlightedRitual: 'hajj' | 'umrah';
}
