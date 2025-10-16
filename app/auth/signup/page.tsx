import { SignUpForm } from "@/components/auth/sign-up-form";
import { getSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  // Redirect if already authenticated
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex min-h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
      <SignUpForm />
    </div>
  );
}