import { MatrimonialProfile, VolunteerApplication, MembershipApplication, NewsletterSubscriber } from '../types';

// --- MATRIMONIAL PROFILES ---
export function subscribeMatrimonialProfiles(callback: (profiles: MatrimonialProfile[]) => void) {
  fetch('/api/matrimony')
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error('Failed to fetch matrimonial profiles:', err));
  return () => {}; // Mock unsubscribe
}

export async function saveMatrimonialProfileToCloud(profile: MatrimonialProfile) {
  const res = await fetch('/api/matrimony', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to save profile');
}

export async function updateMatrimonialStatusInCloud(id: string, status: 'approved' | 'rejected') {
  const res = await fetch(`/api/matrimony/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update profile status');
}

export async function deleteMatrimonialProfileFromCloud(id: string) {
  const res = await fetch(`/api/matrimony/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete profile');
}

// --- VOLUNTEERS ---
export function subscribeVolunteerApps(callback: (apps: VolunteerApplication[]) => void) {
  fetch('/api/volunteers')
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error('Failed to fetch volunteers:', err));
  return () => {};
}

export async function saveVolunteerAppToCloud(appData: VolunteerApplication) {
  const res = await fetch('/api/volunteers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appData)
  });
  if (!res.ok) throw new Error('Failed to save volunteer');
}

export async function updateVolunteerStatusInCloud(id: string, status: 'approved' | 'contacted') {
  const res = await fetch(`/api/volunteers/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update volunteer status');
}

export async function deleteVolunteerAppFromCloud(id: string) {
  const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete volunteer');
}

// --- MEMBERSHIPS ---
export function subscribeMembershipApps(callback: (apps: MembershipApplication[]) => void) {
  fetch('/api/memberships')
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error('Failed to fetch memberships:', err));
  return () => {};
}

export async function saveMembershipAppToCloud(appData: MembershipApplication) {
  const res = await fetch('/api/memberships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appData)
  });
  if (!res.ok) throw new Error('Failed to save membership');
}

export async function updateMembershipStatusInCloud(id: string, status: 'approved' | 'rejected', assignedMemberId?: string) {
  const res = await fetch(`/api/memberships/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, assignedMemberId })
  });
  if (!res.ok) throw new Error('Failed to update membership status');
}

export async function deleteMembershipAppFromCloud(id: string) {
  const res = await fetch(`/api/memberships/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete membership');
}

// --- NEWSLETTER ---
export function subscribeSubscribers(callback: (subs: NewsletterSubscriber[]) => void) {
  fetch('/api/subscribers')
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error('Failed to fetch subscribers:', err));
  return () => {};
}

export async function saveSubscriberToCloud(sub: NewsletterSubscriber) {
  const res = await fetch('/api/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub)
  });
  if (!res.ok) throw new Error('Failed to save subscriber');
}

export async function deleteSubscriberFromCloud(id: string) {
  const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete subscriber');
}
