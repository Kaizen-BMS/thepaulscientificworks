import SuperAdminLayoutClient from "@/components/superadmin/SuperAdminLayoutClient";

export const metadata = { title: "Super Admin — Paul Scientific Works" };

export default function SuperAdminLayout({ children }) {
  // ConditionalLayout skips Navbar/Footer for /superadmin.
  return <SuperAdminLayoutClient>{children}</SuperAdminLayoutClient>;
}