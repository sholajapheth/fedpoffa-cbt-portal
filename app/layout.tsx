import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/lib/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { NotificationContainer } from "@/components/ui/notification-toast";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FEDPOFFA CBT Portal",
  description: "Federal Polytechnic Offa - Computer Based Testing System",
  keywords: [
    "FEDPOFFA",
    "CBT",
    "Computer Based Testing",
    "Federal Polytechnic Offa",
    "Education",
    "Examination",
  ],
  authors: [{ name: "FEDPOFFA IT Department" }],
  creator: "Federal Polytechnic Offa",
  publisher: "Federal Polytechnic Offa",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cbt.fedpoffa.edu.ng",
    title: "FEDPOFFA CBT Portal",
    description: "Federal Polytechnic Offa - Computer Based Testing System",
    siteName: "FEDPOFFA CBT Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "FEDPOFFA CBT Portal",
    description: "Federal Polytechnic Offa - Computer Based Testing System",
  },
  viewport: "width=device-width, initial-scale=1",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <StoreProvider>
              <AuthProvider>
                {children}
                <NotificationContainer />
                <Toaster />
              </AuthProvider>
            </StoreProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
