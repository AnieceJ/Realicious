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

	// 手機測試用，允許某IP連接

	allowedDevOrigins: ["192.168.63.112"],
};

export default nextConfig;
