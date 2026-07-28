"use client";
import "./user.css";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="py-4 bg-[#fafafa] bg-[url(/user/always-grey.png)] bg-repeat bg-size-32px_32px">
      {children}
    </div>
  );
}
