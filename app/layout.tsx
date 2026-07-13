import "./globals.css";


import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { UserProvider } from "@/app/context//user";
import Header from "./_components/header";
import Footer from "./_components/footer";

import { cookies } from "next/headers";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const token = (await cookies()).get("token");

  return (
    <html lang="zh-TW">
      <body className="w-full min-h-screen bg-white flex flex-col">
        <UserProvider>
          <Header token={!!token}></Header>
          <main className="grow w-full">
            <div className="max-w-7xl my-10 mx-auto m-h-150">{children}</div>
          </main>
          <Footer></Footer>
        </UserProvider>
      </body>
    </html>
  );
}
