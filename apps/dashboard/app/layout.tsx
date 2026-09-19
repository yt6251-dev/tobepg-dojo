import type { ReactNode } from "react";

export const metadata = { title: "TobePG Dojo" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: "2rem", maxWidth: 900 }}>{children}</body>
    </html>
  );
}
