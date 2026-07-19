import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
  images: {
		// 🌟 解決關鍵：在本地開發時，如果遇到 private IP 限制，可以直接開啟未優化模式
    // 或者是利用這個參數直接放行本地測試
    unoptimized: process.env.NODE_ENV === "development",
		
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001', 
        pathname: '/**', // 🌟 關鍵修改：改成 '/**', 代表允許該網域下的「任何」路徑與檔案！
      },
      // 💡 既然你有用手機測試（192.168.63.112）的需求，記得把手機連後端的 IP 也順便加進圖片白名單喔！
      {
        protocol: 'http',
        hostname: '192.168.63.112',
        port: '3001',
        pathname: '/**',
      },
    ],
  },

  // 手機測試用，允許某IP連接
  allowedDevOrigins: ["192.168.63.112:3000"], // 這裡通常要加上前端的 port 號（例如 3000）
};

export default nextConfig;