"use client";

import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  account: string;
  role: string;
  nick_name: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  login: (account: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const FAKE_USER_INIT: User = {
  id: "",
  account: "",
  role: "",
  nick_name: "",
  avatar: "",
};

const UserContext = createContext<UserContextType | null>(null);
UserContext.displayName = "UserContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // 🔄 改用 Lazy Initial State：只在組件掛載時執行一次
  const [user, setUser] = useState<User>(() => {
    // 因為在 Next.js (SSR) 環境下，伺服器端渲染時沒有 window 或 document (Cookie)
    // 所以要先確保這段代碼是在瀏覽器端執行
    if (typeof window !== "undefined") {
      const savedUser = Cookies.get("user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error("解析 Cookie 中的使用者資料失敗", e);
        }
      }
    }
    return FAKE_USER_INIT; // 如果沒有 Cookie 或解析失敗，就用初始值
  });

  // 🟢 登入 (純粹負責發送 fetch 給後端)
  const login = async (account: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 驗證成功：寫入 Cookie 並更新狀態
        Cookies.set("token", data.token, { expires: 1 });
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
        
        setUser(data.user);
        
        router.refresh(); 
        return { success: true, message: "登入成功" };
      } else {
        // 後端驗證失敗（由後端決定錯誤訊息，例如：密碼錯誤、帳號不存在）
        return { success: false, message: data.message || "登入失敗" };
      }
    } catch (error) {
      console.error("登入 API 串接失敗:", error);
      return { success: false, message: "伺服器連線失敗，請稍後再試" };
    }
  };

  // 🔴 登出
  const logout = () => {
    const result = confirm("確定要登出嗎？");
    if (result) {
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(FAKE_USER_INIT);
      
      fetch(`${API_URL}/logout`, { method: "POST" }).catch(console.error);

      router.push("/user/login");
      router.refresh();
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw Error("it must be used within UserProvider");
  }
  return context;
};