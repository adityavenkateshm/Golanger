'use client'

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get("redirect_url");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/5 backdrop-blur",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "text-white",
            dividerText: "text-gray-400",
            formFieldLabel: "text-gray-200",
            formFieldInput: "bg-white/5 border-white/10 text-white",
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
            footerActionLink: "text-blue-400 hover:text-blue-300",
          }
        }}
        redirectUrl={redirect_url || '/'}
      />
    </div>
  );
}