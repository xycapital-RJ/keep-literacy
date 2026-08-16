const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export interface AuthPayload {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed (${res.status})`);
  }

  return data as T;
}

export function register(input: RegisterInput): Promise<AuthPayload> {
  return request<AuthPayload>('/auth/register', input);
}

export function login(input: LoginInput): Promise<AuthPayload> {
  return request<AuthPayload>('/auth/login', input);
}
