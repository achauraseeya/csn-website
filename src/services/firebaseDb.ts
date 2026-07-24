import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { MatrimonialProfile, VolunteerApplication, MembershipApplication, NewsletterSubscriber } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// COLLECTIONS CONSTANTS
const MATRIMONY_COL = 'matrimonial_profiles';
const VOLUNTEERS_COL = 'volunteer_applications';
const MEMBERSHIPS_COL = 'membership_applications';
const SUBSCRIBERS_COL = 'newsletter_subscribers';

// Clean object to strip undefined values which cause Firestore setDoc/updateDoc to fail
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        cleaned[key] = sanitizeForFirestore(val);
      } else {
        cleaned[key] = val;
      }
    }
  });
  return cleaned;
}

// --- MATRIMONIAL PROFILES ---
export function subscribeMatrimonialProfiles(callback: (profiles: MatrimonialProfile[]) => void) {
  try {
    const q = query(collection(db, MATRIMONY_COL));
    return onSnapshot(q, (snapshot) => {
      const items: MatrimonialProfile[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as MatrimonialProfile);
      });
      callback(items);
    }, (err) => {
      console.warn('Firestore matrimony snapshot warning:', err);
    });
  } catch (e) {
    console.warn('Firestore init matrimony error:', e);
    return () => {};
  }
}

export async function saveMatrimonialProfileToCloud(profile: MatrimonialProfile) {
  try {
    const cleanData = sanitizeForFirestore(profile);
    await setDoc(doc(db, MATRIMONY_COL, profile.id), cleanData);
    console.log('Saved matrimonial profile to Firestore:', profile.id);
  } catch (e) {
    console.error('Failed to save matrimonial profile to cloud:', e);
    throw e;
  }
}

export async function updateMatrimonialStatusInCloud(id: string, status: 'approved' | 'rejected') {
  try {
    await updateDoc(doc(db, MATRIMONY_COL, id), { status });
  } catch (e) {
    console.error('Failed to update matrimonial status in cloud:', e);
  }
}

export async function deleteMatrimonialProfileFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, MATRIMONY_COL, id));
  } catch (e) {
    console.error('Failed to delete matrimonial profile from cloud:', e);
  }
}

// --- VOLUNTEER APPLICATIONS ---
export function subscribeVolunteerApps(callback: (apps: VolunteerApplication[]) => void) {
  try {
    const q = query(collection(db, VOLUNTEERS_COL));
    return onSnapshot(q, (snapshot) => {
      const items: VolunteerApplication[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as VolunteerApplication);
      });
      callback(items);
    }, (err) => {
      console.warn('Firestore volunteer snapshot warning:', err);
    });
  } catch (e) {
    return () => {};
  }
}

export async function saveVolunteerAppToCloud(appData: VolunteerApplication) {
  try {
    const cleanData = sanitizeForFirestore(appData);
    await setDoc(doc(db, VOLUNTEERS_COL, appData.id), cleanData);
    console.log('Saved volunteer app to Firestore:', appData.id);
  } catch (e) {
    console.error('Failed to save volunteer application to cloud:', e);
    throw e;
  }
}

export async function updateVolunteerStatusInCloud(id: string, status: 'approved' | 'contacted') {
  try {
    await updateDoc(doc(db, VOLUNTEERS_COL, id), { status });
  } catch (e) {
    console.error('Failed to update volunteer status in cloud:', e);
  }
}

export async function deleteVolunteerAppFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, VOLUNTEERS_COL, id));
  } catch (e) {
    console.error('Failed to delete volunteer application from cloud:', e);
  }
}

// --- MEMBERSHIP APPLICATIONS ---
export function subscribeMembershipApps(callback: (apps: MembershipApplication[]) => void) {
  try {
    const q = query(collection(db, MEMBERSHIPS_COL));
    return onSnapshot(q, (snapshot) => {
      const items: MembershipApplication[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as MembershipApplication);
      });
      callback(items);
    }, (err) => {
      console.warn('Firestore membership snapshot warning:', err);
    });
  } catch (e) {
    return () => {};
  }
}

export async function saveMembershipAppToCloud(appData: MembershipApplication) {
  try {
    const cleanData = sanitizeForFirestore(appData);
    await setDoc(doc(db, MEMBERSHIPS_COL, appData.id), cleanData);
    console.log('Saved membership app to Firestore:', appData.id);
  } catch (e) {
    console.error('Failed to save membership application to cloud:', e);
    throw e;
  }
}

export async function updateMembershipStatusInCloud(id: string, status: 'approved' | 'rejected') {
  try {
    await updateDoc(doc(db, MEMBERSHIPS_COL, id), { status });
  } catch (e) {
    console.error('Failed to update membership status in cloud:', e);
  }
}

export async function deleteMembershipAppFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, MEMBERSHIPS_COL, id));
  } catch (e) {
    console.error('Failed to delete membership application from cloud:', e);
  }
}

// --- NEWSLETTER SUBSCRIBERS ---
export function subscribeSubscribers(callback: (subscribers: NewsletterSubscriber[]) => void) {
  try {
    const q = query(collection(db, SUBSCRIBERS_COL));
    return onSnapshot(q, (snapshot) => {
      const items: NewsletterSubscriber[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as NewsletterSubscriber);
      });
      callback(items);
    }, (err) => {
      console.warn('Firestore subscribers snapshot warning:', err);
    });
  } catch (e) {
    return () => {};
  }
}

export async function saveSubscriberToCloud(sub: NewsletterSubscriber) {
  try {
    const cleanData = sanitizeForFirestore(sub);
    await setDoc(doc(db, SUBSCRIBERS_COL, sub.id), cleanData);
    console.log('Saved subscriber to Firestore:', sub.id);
  } catch (e) {
    console.error('Failed to save subscriber to cloud:', e);
    throw e;
  }
}

export async function deleteSubscriberFromCloud(id: string) {
  try {
    await deleteDoc(doc(db, SUBSCRIBERS_COL, id));
  } catch (e) {
    console.error('Failed to delete subscriber from cloud:', e);
  }
}
