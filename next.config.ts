import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://ekatktsqctrcchuevokn.supabase.co/**"),
      new URL("http://127.0.0.1:54321/**"),
      new URL("https://lh3.googleusercontent.com/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
