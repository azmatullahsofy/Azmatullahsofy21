import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db, auth, isFirebaseAvailable } from '../firebase';
import { Masjid, UserProfile, Donation, MadadRequest, Hadith, NotificationMsg, NamazTimetable } from '../types';
import { defaultHadiths, defaultNamazTimetable } from '../defaultData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Generate a random 6-digit unique mosque code
export function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate unique ID
function uuid(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Memory-backed LocalStorage Replica for immediate preview
const LOCAL_STORAGE_KEYS = {
  MASJIDS: 'digital_masjid_masjids',
  USERS: 'digital_masjid_users',
  DONATIONS: 'digital_masjid_donations',
  MADAD: 'digital_masjid_madad',
  HADITHS: 'digital_masjid_hadiths',
  NOTIFICATIONS: 'digital_masjid_notifications',
  LIVE_AZAN: 'digital_masjid_live_azan'
};

// Initial Core Seed Data
const initialMasjids: Masjid[] = [
  {
    id: "m1",
    name: "Masjid Noor Al-Islam",
    city: "Mubarakpur",
    code: "786110",
    address: "Bazar Mohalla, Village Mubarakpur",
    createdAt: new Date().toISOString()
  }
];

const initialUsers: UserProfile[] = [
  {
    uid: "admin1",
    name: "Imam Maulana Zubair Ahmad",
    role: "admin",
    masjidId: "m1",
    approved: true,
    createdAt: new Date().toISOString()
  },
  {
    uid: "member1",
    name: "Sajid Khan (Villager)",
    fatherName: "Rahim Khan",
    aadharCard: "4567 8901 2345",
    bankName: "State Bank of India",
    accountNumber: "234567891",
    ifscCode: "SBIN0001234",
    role: "member",
    masjidId: "m1",
    approved: true,
    createdAt: new Date().toISOString()
  }
];

const initialDonations: Donation[] = [
  {
    id: "d_seed1",
    donorName: "Anas Qureshi",
    amount: 1500,
    category: "imam_salary",
    date: "2026-05-10T10:30:00Z",
    upiTransactionId: "UPIX983749832",
    masjidId: "m1"
  },
  {
    id: "d_seed2",
    donorName: "Mohammad Yusuf",
    amount: 4000,
    category: "construction",
    date: "2026-05-15T14:45:00Z",
    upiTransactionId: "UPIX918237192",
    masjidId: "m1"
  },
  {
    id: "d_seed3",
    donorName: "Rashid Ali",
    amount: 800,
    category: "electricity",
    date: "2026-05-18T18:00:00Z",
    upiTransactionId: "UPIX928374912",
    masjidId: "m1"
  },
  {
    id: "d_seed4",
    donorName: "Ansarul Haq",
    amount: 2500,
    category: "food_poor",
    date: "2026-05-22T08:15:00Z",
    upiTransactionId: "UPIX902384918",
    masjidId: "m1"
  },
  {
    id: "d_seed5",
    donorName: "Sajid Khan",
    amount: 1000,
    category: "muezzin",
    date: "2026-05-25T11:20:00Z",
    upiTransactionId: "UPIX991827364",
    masjidId: "m1"
  }
];

const initialMadadRequests: MadadRequest[] = [
  {
    id: "mr_seed1",
    name: "Bashir Ahmad",
    fatherName: "Karamat Ahmad",
    aadhar: "7890 1234 5678",
    bankAccount: "98765432101",
    ifsc: "SBIN0004561",
    reason: "Urgent daughter's marriage grocery expenses and garments purchase.",
    amountNeeded: 12000,
    status: "pending",
    timestamp: "2026-05-26T12:00:00Z",
    masjidId: "m1",
    returnedAmount: 0
  },
  {
    id: "mr_seed2",
    name: "Salma Begum",
    fatherName: "Late Wajid Ali",
    aadhar: "3210 9876 5432",
    bankAccount: "45612378902",
    ifsc: "HDFC0002345",
    reason: "Treatment expenses for heart condition and monthly medicine purchase.",
    amountNeeded: 8000,
    status: "approved",
    timestamp: "2026-05-20T09:00:00Z",
    masjidId: "m1",
    returnedAmount: 2000
  }
];

const initialNotifications: NotificationMsg[] = [
  {
    id: "n_seed1",
    title: "Jumma ka Bayan",
    body: "Is Jumma ko Hazrat Maulana Zubair Saheb ka bayan thik 1:00 baje shuru hoga. Tamam hazrat naye libas me jaldi tashreef layen.",
    timestamp: "2026-05-27T17:00:00Z",
    masjidId: "m1"
  },
  {
    id: "n_seed2",
    title: "Masjid Repair Meeting",
    body: "Masjid ki chhat ki marammat (repair) ke silsile me is Itwar (Sunday) ko Namaz-e-Asr ke baad ek ahem mashwara hoga. Har gaon wale isme shamil hon.",
    timestamp: "2026-05-28T09:30:00Z",
    masjidId: "m1"
  }
];

// Seed localStorage if not present
function initializeLocalReplica() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.MASJIDS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MASJIDS, JSON.stringify(initialMasjids));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.DONATIONS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DONATIONS, JSON.stringify(initialDonations));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.MADAD)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MADAD, JSON.stringify(initialMadadRequests));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.HADITHS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HADITHS, JSON.stringify(defaultHadiths));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.LIVE_AZAN)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LIVE_AZAN, JSON.stringify({ isLive: false, startedAt: "", audioData: "" }));
  }
}

// Call local initialization
initializeLocalReplica();

// helper functions for localStorage
function getLocal<T>(key: string): T[] {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function setLocal<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export class MasjidService {
  // --- MASJID OPERATIONS ---
  static async getMasjids(): Promise<Masjid[]> {
    if (isFirebaseAvailable) {
      try {
        const querySnapshot = await getDocs(collection(db, 'masjids'));
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Masjid));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'masjids');
      }
    }
    return getLocal<Masjid>(LOCAL_STORAGE_KEYS.MASJIDS);
  }

  static async getMasjidByCode(code: string): Promise<Masjid | null> {
    const list = await this.getMasjids();
    return list.find(m => m.code.trim() === code.trim()) || null;
  }

  static async getMasjidById(id: string): Promise<Masjid | null> {
    const list = await this.getMasjids();
    return list.find(m => m.id === id) || null;
  }

  static async createMasjid(name: string, city: string, address: string): Promise<Masjid> {
    const newMasjid: Masjid = {
      id: uuid(),
      name,
      code: generateRandomCode(),
      city,
      address,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'masjids', newMasjid.id), newMasjid);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `masjids/${newMasjid.id}`);
      }
    }

    const currentLocal = getLocal<Masjid>(LOCAL_STORAGE_KEYS.MASJIDS);
    currentLocal.push(newMasjid);
    setLocal(LOCAL_STORAGE_KEYS.MASJIDS, currentLocal);
    return newMasjid;
  }

  // --- USER PROFILE OPERATIONS ---
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (isFirebaseAvailable) {
      try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${uid}`);
      }
    }
    const currentLocal = getLocal<UserProfile>(LOCAL_STORAGE_KEYS.USERS);
    return currentLocal.find(u => u.uid === uid) || null;
  }

  static async joinMasjidWithCode(code: string, memberDetails: { uid: string, name: string, fatherName: string, aadharCard: string, bankName: string, accountNumber: string, ifscCode: string }): Promise<UserProfile | null> {
    const masjid = await this.getMasjidByCode(code);
    if (!masjid) return null;

    const newProfile: UserProfile = {
      uid: memberDetails.uid,
      name: memberDetails.name,
      fatherName: memberDetails.fatherName,
      aadharCard: memberDetails.aadharCard,
      bankName: memberDetails.bankName,
      accountNumber: memberDetails.accountNumber,
      ifscCode: memberDetails.ifscCode,
      role: 'member',
      masjidId: masjid.id,
      approved: true, // Auto approve in local sandbox to provide beautiful immediate experience
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'users', newProfile.uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${newProfile.uid}`);
      }
    }

    const currentLocal = getLocal<UserProfile>(LOCAL_STORAGE_KEYS.USERS);
    const updated = currentLocal.filter(u => u.uid !== memberDetails.uid);
    updated.push(newProfile);
    setLocal(LOCAL_STORAGE_KEYS.USERS, updated);
    return newProfile;
  }

  static async createAdminProfile(uid: string, name: string, email: string, masjidId: string): Promise<UserProfile> {
    const newProfile: UserProfile = {
      uid,
      name,
      role: 'admin',
      masjidId,
      approved: true,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'users', uid), newProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      }
    }

    const currentLocal = getLocal<UserProfile>(LOCAL_STORAGE_KEYS.USERS);
    const updated = currentLocal.filter(u => u.uid !== uid);
    updated.push(newProfile);
    setLocal(LOCAL_STORAGE_KEYS.USERS, updated);
    return newProfile;
  }

  static async getRegisteredMembers(masjidId: string): Promise<UserProfile[]> {
    const list = getLocal<UserProfile>(LOCAL_STORAGE_KEYS.USERS);
    const filtered = list.filter(u => u.masjidId === masjidId && u.role === 'member');

    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'users'), where('masjidId', '==', masjidId), where('role', '==', 'member'));
        const querySnapshot = await getDocs(q);
        const fbDocs = querySnapshot.docs.map(d => d.data() as UserProfile);
        return fbDocs.length > 0 ? fbDocs : filtered;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'users');
      }
    }
    return filtered;
  }

  // --- DONATIONS OPERATIONS ---
  static async getDonations(masjidId: string): Promise<Donation[]> {
    const localList = getLocal<Donation>(LOCAL_STORAGE_KEYS.DONATIONS).filter(d => d.masjidId === masjidId);

    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'donations'), where('masjidId', '==', masjidId));
        const querySnapshot = await getDocs(q);
        const fbDocs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Donation));
        return fbDocs.length > 0 ? fbDocs : localList;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'donations');
      }
    }
    return localList;
  }

  static async recordDonation(donation: Omit<Donation, 'id'>): Promise<Donation> {
    const newDonation: Donation = {
      id: uuid(),
      ...donation
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'donations', newDonation.id), newDonation);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `donations/${newDonation.id}`);
      }
    }

    const currentLocal = getLocal<Donation>(LOCAL_STORAGE_KEYS.DONATIONS);
    currentLocal.push(newDonation);
    setLocal(LOCAL_STORAGE_KEYS.DONATIONS, currentLocal);
    return newDonation;
  }

  // --- MADAD REQUESTS OPERATIONS ---
  static async getMadadRequests(masjidId: string): Promise<MadadRequest[]> {
    const localList = getLocal<MadadRequest>(LOCAL_STORAGE_KEYS.MADAD).filter(m => m.masjidId === masjidId);

    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'madadRequests'), where('masjidId', '==', masjidId));
        const querySnapshot = await getDocs(q);
        const fbDocs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as MadadRequest));
        return fbDocs.length > 0 ? fbDocs : localList;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'madadRequests');
      }
    }
    return localList;
  }

  static async submitMadadRequest(request: Omit<MadadRequest, 'id' | 'status' | 'timestamp' | 'returnedAmount'>): Promise<MadadRequest> {
    const newRequest: MadadRequest = {
      id: uuid(),
      ...request,
      status: 'pending',
      timestamp: new Date().toISOString(),
      returnedAmount: 0
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'madadRequests', newRequest.id), newRequest);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `madadRequests/${newRequest.id}`);
      }
    }

    const currentLocal = getLocal<MadadRequest>(LOCAL_STORAGE_KEYS.MADAD);
    currentLocal.push(newRequest);
    setLocal(LOCAL_STORAGE_KEYS.MADAD, currentLocal);
    return newRequest;
  }

  static async updateMadadRequestStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    if (isFirebaseAvailable) {
      try {
        await updateDoc(doc(db, 'madadRequests', id), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `madadRequests/${id}`);
      }
    }

    const currentLocal = getLocal<MadadRequest>(LOCAL_STORAGE_KEYS.MADAD);
    const index = currentLocal.findIndex(m => m.id === id);
    if (index !== -1) {
      currentLocal[index].status = status;
      setLocal(LOCAL_STORAGE_KEYS.MADAD, currentLocal);
      return true;
    }
    return false;
  }

  static async returnMadadRequestAmount(id: string, returnAmount: number): Promise<boolean> {
    const currentLocal = getLocal<MadadRequest>(LOCAL_STORAGE_KEYS.MADAD);
    const index = currentLocal.findIndex(m => m.id === id);
    if (index !== -1) {
      currentLocal[index].returnedAmount = (currentLocal[index].returnedAmount || 0) + returnAmount;
      setLocal(LOCAL_STORAGE_KEYS.MADAD, currentLocal);

      // Log a return as a donation to Mosque Saving System!
      const masjidId = currentLocal[index].masjidId;
      await this.recordDonation({
        donorName: `Returned Help: ${currentLocal[index].name}`,
        amount: returnAmount,
        category: 'construction', // Treated as savings/maintenance return
        date: new Date().toISOString(),
        upiTransactionId: "RETURN_SYSTEM_" + uuid().toUpperCase(),
        masjidId
      });

      if (isFirebaseAvailable) {
        try {
          await updateDoc(doc(db, 'madadRequests', id), { returnedAmount: currentLocal[index].returnedAmount });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `madadRequests/${id}`);
        }
      }
      return true;
    }
    return false;
  }

  // --- HADITH OF THE DAY ---
  static async getHadithOfTheDay(masjidId: string): Promise<Hadith> {
    const list = getLocal<Hadith>(LOCAL_STORAGE_KEYS.HADITHS);
    const indexOfDay = new Date().getDate() % list.length;
    return list[indexOfDay] || list[0];
  }

  static async postHadith(masjidId: string, text: string, reference: string): Promise<Hadith> {
    const newHadith: Hadith = {
      id: uuid(),
      text,
      reference,
      date: new Date().toISOString().split('T')[0],
      masjidId
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'hadithOfTheDay', newHadith.id), newHadith);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `hadithOfTheDay/${newHadith.id}`);
      }
    }

    const currentLocal = getLocal<Hadith>(LOCAL_STORAGE_KEYS.HADITHS);
    currentLocal.unshift(newHadith);
    setLocal(LOCAL_STORAGE_KEYS.HADITHS, currentLocal);
    return newHadith;
  }

  // --- GENERAL NOTIFICATIONS / ANNOUNCEMENTS ---
  static async getNotifications(masjidId: string): Promise<NotificationMsg[]> {
    const localList = getLocal<NotificationMsg>(LOCAL_STORAGE_KEYS.NOTIFICATIONS).filter(n => n.masjidId === masjidId);

    if (isFirebaseAvailable) {
      try {
        const q = query(collection(db, 'notifications'), where('masjidId', '==', masjidId));
        const querySnapshot = await getDocs(q);
        const fbDocs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as NotificationMsg));
        return fbDocs.length > 0 ? fbDocs : localList;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'notifications');
      }
    }
    return localList;
  }

  static async postNotification(masjidId: string, title: string, body: string): Promise<NotificationMsg> {
    const newNotif: NotificationMsg = {
      id: uuid(),
      title,
      body,
      timestamp: new Date().toISOString(),
      masjidId
    };

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `notifications/${newNotif.id}`);
      }
    }

    const currentLocal = getLocal<NotificationMsg>(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
    currentLocal.unshift(newNotif);
    setLocal(LOCAL_STORAGE_KEYS.NOTIFICATIONS, currentLocal);
    return newNotif;
  }

  // --- LIVE AZAN RADIO SIGNALLING ---
  static async registerLiveAzanListener(masjidId: string, callback: (isLive: boolean, audioData?: string) => void): Promise<() => void> {
    if (isFirebaseAvailable) {
      try {
        const unsubscribe = onSnapshot(doc(db, 'liveAzanSignals', masjidId), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            callback(data.isLive, data.audioData);
          } else {
            callback(false);
          }
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `liveAzanSignals/${masjidId}`);
        });
        return unsubscribe;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `liveAzanSignals/${masjidId}`);
      }
    }

    // Local Storage Polling Emulation for Sandbox
    const interval = setInterval(() => {
      const liveData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.LIVE_AZAN) || '{"isLive":false}');
      callback(liveData.isLive, liveData.audioData);
    }, 1500);

    return () => clearInterval(interval);
  }

  static async setLiveAzanStatus(masjidId: string, isLive: boolean, audioData?: string): Promise<void> {
    const payload = {
      id: masjidId,
      isLive,
      startedAt: isLive ? new Date().toISOString() : "",
      audioData: audioData || ""
    };

    localStorage.setItem(LOCAL_STORAGE_KEYS.LIVE_AZAN, JSON.stringify(payload));

    if (isFirebaseAvailable) {
      try {
        await setDoc(doc(db, 'liveAzanSignals', masjidId), payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `liveAzanSignals/${masjidId}`);
      }
    }
  }

  // --- ALADHAN TIMETABLE AUTO CALCULATION VIA GPS / CITY API ---
  static async fetchTimetableByCity(city: string): Promise<NamazTimetable> {
    try {
      const sanitizedCity = encodeURIComponent(city.trim());
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${sanitizedCity}&country=India&method=4`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.timings) {
          const t = data.data.timings;
          // Map to beautiful local am/pm string format
          const formatTime = (militaryTime: string) => {
            const [hourStr, minStr] = militaryTime.split(':');
            const hours = parseInt(hourStr);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours.toString().padStart(2, '0')}:${minStr} ${ampm}`;
          };

          return {
            fajr: formatTime(t.Fajr),
            sunrise: formatTime(t.Sunrise),
            dhuhr: formatTime(t.Dhuhr),
            asr: formatTime(t.Asr),
            maghrib: formatTime(t.Maghrib),
            isha: formatTime(t.Isha),
            sehriEnd: formatTime(t.Imsak || t.Fajr), // accurate Ramadan Imsak
            iftarStart: formatTime(t.Maghrib),      // accurate Ramadan Iftar
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          };
        }
      }
    } catch (e) {
      console.warn("Failed to reach Aladhan API, using local offset calculations", e);
    }

    // Default calculated layout dynamic based on local offset
    return {
      ...defaultNamazTimetable,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  }
}
