const STORAGE_KEY = 'teacher_username';

export function setTeacherUsername(username: string) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, username);
}

export function clearTeacherUsername() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getStoredTeacherUsername(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(STORAGE_KEY);
}
