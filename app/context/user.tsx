"use client";

import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const FAKE_USER = {
  id: "1",
  account: "test@example.com",
  role: "11",
  nick_name: "福利熊",
  avatar: "123",
};
const FAKE_USER_INIT = {
  id: "",
  account: "",
  role: "",
  nick_name: "",
  avatar: "",
};
const FAKE_TOKEN = "mock-jwt-token-xyz";

interface User {
  id: string;
  account: string;
  role: string;
  nick_name: string;
  avatar: string;
}
interface UserContextType {
  user: User;
  login: (account: string, password: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);
UserContext.displayName = "UserContext";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(FAKE_USER_INIT);

  const login = (account: string, password: string) => {
    // 方便測試用，之後要加格式判斷，傳到後端驗證，後端回傳boolean
    if (account === "123@gmail.com" && password === "zxc123") {
      Cookies.set("token", FAKE_TOKEN, { expires: 1 });
      Cookies.set("user", JSON.stringify(FAKE_USER), { expires: 1 });
      setUser(FAKE_USER);
      router.refresh()
      return true;
    }
    return false;
  };
  const logout = () => {
    const result = confirm("確定要登出嗎？");
    if (result) {
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(FAKE_USER_INIT);
      router.push("/user/login");
      router.refresh();
    } else {
      return;
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
