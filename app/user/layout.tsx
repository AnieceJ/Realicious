"use client";
import "./user.css";
import { AlertProvider } from "./context/alert";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AlertProvider>{children}</AlertProvider>;
    </div>
  );
}
