import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata = { title: "Admin — Paul Scientific Works" };

export default function AdminLayout({ children }) {
  // ConditionalLayout skips Navbar/Footer for /admin.
  // We just provide the admin shell here.
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}