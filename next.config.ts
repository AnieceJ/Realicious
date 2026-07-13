import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};
// 手機測試用，允許某IP連接
module.exports = {
  allowedDevOrigins: ['192.168.63.112'],
} 

export default nextConfig;
