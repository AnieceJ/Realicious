"use client";
import "./user.css";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const usesArticleBackground = [
    "/user/account/article",
    "/user/account/saved-articles",
  ].includes(pathname);

  return (
    <div
      className={
        usesArticleBackground
          ? "py-4"
          : "py-4 bg-[#fafafa] bg-[url(/user/always-grey.png)] bg-repeat bg-size-32px_32px"
      }
    >
      {children}
    </div>
  );
}
