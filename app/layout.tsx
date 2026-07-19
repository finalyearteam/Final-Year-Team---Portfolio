import type { Metadata } from "next";
import "./globals.css";
// 1. Import the Header component!

export const metadata: Metadata = {
  title: "Final Year Team - GCOERC, Nashik",
  description: "Final Year Engineering Collaboration Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-white min-h-screen antialiased">
        {/* 2. Place the Header above your children! */}

        
        <main className="pt-20"> {/* Added padding so content doesn't hide behind the fixed header */}
          {children}
        </main>

      </body>
    </html>
  );
}
