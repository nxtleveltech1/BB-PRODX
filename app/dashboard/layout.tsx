import { requireAuth } from "@/lib/auth-client";
import { UserMenu } from "@/components/auth/user-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="container py-8">
      <header className="mb-8 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user.name || user.email}
          </p>
        </div>
        <UserMenu />
      </header>
      <main>{children}</main>
    </div>
  );
}