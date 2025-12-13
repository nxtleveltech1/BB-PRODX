import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  // Redirect if already authenticated
  // Only redirect if we have a valid session with user data
  const session = await getSession();
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex min-h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
      <SignInForm />
    </div>
  );
}