/** Reserved demo admin for local/dev testing. Michael still registers once via /admin/setup. */
export const DEMO_ADMIN = {
  email: "demo@mcso.local",
  password: "MCSO-Demo-2026!",
  name: "Demo Admin",
} as const;

export function isDemoEmail(email: string) {
  return email.toLowerCase().trim() === DEMO_ADMIN.email;
}
