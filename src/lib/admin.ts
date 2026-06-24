// カンマ区切りで複数の管理者メールを指定可能
// 例: NEXT_PUBLIC_ADMIN_EMAIL="a@example.com,b@example.com"
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@ai-builders-lab.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// 表示・後方互換のため先頭の1件を公開
export const ADMIN_EMAIL = ADMIN_EMAILS[0];

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
