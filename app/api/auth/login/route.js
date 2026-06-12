import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminByEmail } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const admin = getAdminByEmail(email.toLowerCase().trim());
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });

   const response = NextResponse.json({
  success: true,
  user: {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  },
});

response.cookies.set({
  name: COOKIE_NAME,
  value: token,
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

console.log("COOKIE SET:", COOKIE_NAME);

return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}