import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. 從 Cookie 中嘗試取得登入憑證 (Token)
  // 註：這取決於你的登入 Hook 是把 Token 存在 Cookie 還是 LocalStorage。
  // 因為 Middleware 跑在伺服器端，登入狀態必須存在 Cookie 才能讀到。
  const token = request.cookies.get('token')?.value; 

  const isLoginPage = request.nextUrl.pathname === '/user/login';

  // 2. 如果沒有 Token，而且想進入被保護的頁面 -> 強制導向到登入頁
  if (!token && !isLoginPage) {
    // 這裡還可以順便記錄原本想去的網址，登入後自動跳回來（這就是你上一題想實作的概念！）
    const loginUrl = new URL('/user/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // 3. 如果已經登入，卻還想去登入頁 -> 直接導向到後台/首頁
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 放行
  return NextResponse.next();
}

// 4. 設定「哪些網址」需要經過這個 Middleware 檢查
export const config = {
  matcher: [
    // 登入頁本身也要檢查（防止重複登入）
    '/user/login',
    '/user/account',
    '/user/chatroom',
  ],
};