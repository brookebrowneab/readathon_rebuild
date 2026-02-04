export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: ApiError;
}

export interface ChildSummary {
  id: string;
  name: string;
  total_minutes: number;
  goal_minutes: number;
  grade_info?: string | null;
  class_name?: string | null;
}

export interface StudentSummary {
  id: string;
  name: string;
  total_minutes: number;
  goal_minutes: number;
}

export interface ReadingLogEntry {
  id: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
  status: string;
  child_id?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  teacher_type: string;
  grade_level: string | null;
  has_full_access: boolean;
}

export interface TeacherStudent {
  id: string;
  name: string;
  student_username: string;
  grade_info: string;
  class_name: string;
  goal_minutes: number;
  total_minutes: number;
}

export interface AdminLoginResponse {
  success: boolean;
  admin: { id: number; email: string; username: string };
}

export interface AdminMetrics {
  studentsEnrolled: number;
  totalMinutes: number;
  totalPledged: number;
  totalCollected: number;
}

export interface AdminAlert {
  id: string;
  count: number;
  label: string;
  link: string;
}

export interface AdminActivity {
  type: string;
  message: string;
  time: string;
}

export interface OutstandingPledge {
  id: string;
  sponsor: { name: string };
  student: { id: string };
  amount: number;
  unit: string;
  is_paid: boolean;
  created_at: string;
}

export interface ActiveEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  goal_minutes: number | null;
}

export interface PublicChild {
  id: string;
  display_name: string;
  grade_info: string;
  total_minutes: number;
  goal_minutes?: number;
}

export interface PledgeSummary {
  id: string;
  child_id: string;
  amount: number;
  pledge_type: string;
  is_paid: boolean;
  child?: { name: string } | null;
}

export interface GuestPaySummary {
  amount: number;
  student_name: string | null;
}

export interface PaymentResult {
  success: boolean;
  receiptUrl?: string;
}

export interface ParentReadingLogEntry {
  id: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  display_name?: string | null;
  user_type: string;
  username?: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export function getTeacherUsername(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem('teacher_username');
  return (
    stored ||
    import.meta.env.VITE_TEST_TEACHER_USERNAME ||
    import.meta.env.VITE_TEACHER_USERNAME ||
    (window as any).__TEST_TEACHER_USERNAME ||
    null
  );
}

function getTeacherHeaders() {
  const testUsername =
    import.meta.env.VITE_TEST_TEACHER_USERNAME || (window as any).__TEST_TEACHER_USERNAME;
  if (!testUsername) {
    return {};
  }
  return { 'X-Teacher-Username': testUsername };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    credentials: 'include',
    ...options,
  });

  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!payload.ok) {
    throw payload.error || { code: 'INTERNAL', message: 'Unknown error' };
  }

  return payload.data as T;
}

export async function studentLogin(username: string, password: string) {
  return request<{ success: boolean; child: StudentSummary }>('/api/functions/student-login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function getStudentMe() {
  return request<StudentSummary>('/api/student/me');
}

export async function listStudentReadingLogs() {
  return request<ReadingLogEntry[]>('/api/student/reading-logs');
}

export async function createStudentReadingLog(payload: {
  minutes: number;
  book_title?: string | null;
  logged_at?: string;
}) {
  return request<ReadingLogEntry>('/api/student/reading-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTeacherProfile(username: string) {
  return request<TeacherProfile>(
    `/api/teachers?user_id=eq.${encodeURIComponent(username)}&is_active=eq.true`,
    { headers: getTeacherHeaders() }
  );
}

export async function listTeacherStudents(username: string) {
  return request<TeacherStudent[]>(
    `/api/children?homeroom_teacher_id=eq.${encodeURIComponent(username)}`,
    { headers: getTeacherHeaders() }
  );
}

export async function listTeacherReadingLogs(childIds: string[]) {
  if (childIds.length === 0) {
    return [];
  }
  const encoded = childIds.map(encodeURIComponent).join(',');
  return request<ReadingLogEntry[]>(`/api/reading_logs?child_id=in.(${encoded})`, {
    headers: getTeacherHeaders(),
  });
}

export async function createTeacherReadingLog(payload: {
  child_id: string;
  minutes: number;
  book_title?: string | null;
  logged_at?: string;
}) {
  return request<ReadingLogEntry>('/api/reading_logs', {
    method: 'POST',
    headers: getTeacherHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function adminLogin(email: string, password: string) {
  return request<AdminLoginResponse>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function teacherLogin(email: string, password: string) {
  return request<AuthResponse>('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getAdminMetrics() {
  return request<AdminMetrics>('/api/admin/metrics');
}

export async function getAdminAlerts() {
  return request<AdminAlert[]>('/api/admin/alerts');
}

export async function getAdminActivity(limit = 10) {
  return request<AdminActivity[]>(`/api/admin/activity?limit=${limit}`);
}

export async function getOutstandingPledges(limit = 5) {
  return request<OutstandingPledge[]>(`/api/admin/reports/outstanding?limit=${limit}`);
}

export async function getActiveEvent() {
  return request<ActiveEvent | null>('/api/events?is_active=true');
}

export async function getSiteContent() {
  return request<Array<{ key: string; value: string }>>('/api/site-content');
}

export async function listPublicChildrenByFamily(userId: string) {
  return request<PublicChild[]>(
    `/api/children_public_safe?user_id=eq.${encodeURIComponent(userId)}&share_public_link=eq.true`
  );
}

export async function getPublicChild(childId: string) {
  return request<PublicChild>(`/api/children_public_safe?id=eq.${encodeURIComponent(childId)}`);
}

export async function createPledges(payload: Array<{ child_id: string; amount: number; pledge_type: string }>) {
  return request<{ id: string }[]>('/api/pledges', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listUnpaidPledges() {
  return request<PledgeSummary[]>('/api/pledges?is_paid=eq.false');
}

export async function processSquarePayment(payload: {
  amount: number;
  pledgeIds?: string[];
  payerName: string;
  payerEmail: string;
  sourceId: string;
}) {
  return request<PaymentResult>('/api/functions/process-square-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function notifyCheckPayment(payload: {
  amount: number;
  pledgeIds?: string[];
  payerName: string;
  payerEmail?: string;
}) {
  return request<{ success: boolean }>('/api/functions/notify-check-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getGuestPay(token: string) {
  return request<GuestPaySummary>(`/api/guest/pay/${encodeURIComponent(token)}`);
}

export async function checkoutGuestPay(token: string, payload: {
  amount: number;
  payerName: string;
  payerEmail?: string;
  sourceId?: string;
  payment_method?: 'card';
}) {
  return request<{ success: boolean; checkoutUrl?: string }>(
    `/api/guest/pay/${encodeURIComponent(token)}/checkout`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export async function listParentChildren() {
  return request<ChildSummary[]>('/api/me/children');
}

export async function listChildReadingLogs(childId: string) {
  return request<ParentReadingLogEntry[]>(`/api/me/reading-logs?child_id=eq.${childId}`);
}

export async function listReadingLogsByChildIds(childIds: string[]) {
  const joined = childIds.join(',');
  return request<ParentReadingLogEntry[]>(`/api/me/reading-logs?child_id=in.(${joined})`);
}

export async function createParentReadingLog(payload: {
  child_id: string;
  minutes: number;
  book_title?: string | null;
  logged_at?: string;
}) {
  return request<ParentReadingLogEntry>('/api/me/reading-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateReadingLog(
  id: string,
  payload: { minutes?: number; book_title?: string | null; logged_at?: string }
) {
  return request<ParentReadingLogEntry>(`/api/me/reading-logs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteReadingLog(id: string) {
  return request<null>(`/api/me/reading-logs/${id}`, {
    method: 'DELETE',
  });
}

export async function logout() {
  return request<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}
