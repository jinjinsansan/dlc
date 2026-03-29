export const ADMIN_EMAIL = "admin@dlogic-academy.com";

export function isAdmin(email: string | undefined | null): boolean {
  return email === ADMIN_EMAIL;
}
