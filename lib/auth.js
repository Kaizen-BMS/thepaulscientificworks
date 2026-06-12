import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "psw-secret-2024-change-in-prod";
export const COOKIE_NAME = "psw_admin_token";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(role = null) {
  const session = await getSession();
  if (!session) return null;
  if (role === "superadmin" && session.role !== "superadmin") return null;
  return session;
}