import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "529 College Savings Planner",
  description: "Interactive NY 529 rebalancing and projection tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
