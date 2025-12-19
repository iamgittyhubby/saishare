import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaiShare",
  description: "Writing about AI, work systems, and life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mx-auto w-full max-w-2xl px-6 md:px-0">
          {children}
        </div>
      </body>
    </html>
  );
}