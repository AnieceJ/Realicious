import "./globals.css";


import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { UserProvider } from "@/app/context//user";
import Header from "./_components/header";
import Footer from "./_components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="w-full min-h-screen bg-white flex flex-col">
        <UserProvider>
          <Header></Header>
          <main className="grow w-full">
            <div className="max-w-7xl my-10 mx-auto m-h-150">{children}</div>
          </main>
          <Footer></Footer>
        </UserProvider>
      </body>
    </html>
  );
}
