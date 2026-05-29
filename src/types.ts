export type Role = 'admin' | 'member' | 'guest';

export type Language = 'en' | 'hi' | 'ur';

export interface Masjid {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  fatherName?: string;
  aadharCard?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  role: Role;
  masjidId: string;
  approved: boolean;
  createdAt: string;
  phone?: string;
  username?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  category: 'imam_salary' | 'muezzin' | 'electricity' | 'construction' | 'food_poor';
  date: string;
  upiTransactionId?: string;
  masjidId: string;
}

export interface MadadRequest {
  id: string;
  name: string;
  fatherName: string;
  aadhar: string;
  bankAccount: string;
  ifsc: string;
  reason: string;
  amountNeeded: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  masjidId: string;
  returnedAmount: number;
}

export interface Hadith {
  id: string;
  text: string;
  reference: string;
  date: string;
  masjidId: string;
}

export interface NotificationMsg {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  masjidId: string;
}

export interface NamazTimetable {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sehriEnd: string;
  iftarStart: string;
  date: string;
}

export interface DuaItem {
  id: string;
  title: {
    en: string;
    hi: string;
    ur: string;
  };
  arabic: string;
  translation: {
    en: string;
    hi: string;
    ur: string;
  };
  audioUrl?: string;
  category?: string;
}
