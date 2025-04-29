import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import LogoMain from "../../public/images/logos/logo_main.svg";
import { MobileMenu } from "@/components/MobileMenu";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToastProvider } from "@/components/toast/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Golanger.co - A Golang Job Board",
  description: "Find or post high-quality Golang jobs. Built for developers and hiring teams who love Go.",
  icons: {
    icon: "/images/logos/favicon.svg",
    shortcut: "/images/logos/favicon.svg",
    apple: "/images/logos/logo_icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <ClerkProvider>
        <body className="bg-slate-900 text-slate-50 font-sans min-h-screen">
         <ToastProvider>
          <header>
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between border-b border-white/10">
              <Link href="/" className="text-xl font-bold flex items-center shrink-0">
                <Image
                  src={LogoMain}
                  alt="Golanger"
                  width={50}
                  height={50}
                  className="mr-1"
                />
                <span className="text-blue-300">Golanger</span>
                <span className="text-gray-500">.co</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center justify-end gap-9 flex-1">
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
                <Link
                  href="/jobs/post"
                  className="text-gray-300 hover:text-white"
                >
                  Post a Job
                </Link>
                <SignedIn>
                  {/* <Link
                    href="/profile"
                    className="text-gray-300 hover:text-white"
                  >
                    Profile
                  </Link> */}
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <button className="text-white hover:text-sky-400">
                        Sign In
                      </button>
                    </SignInButton>
                    <span className="text-gray-500">|</span>
                    <SignUpButton mode="modal">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </div>

              {/* Mobile Menu */}
              <MobileMenu />
            </nav>
            <Breadcrumbs />
          </header>
          <main>{children}</main>
         </ToastProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
