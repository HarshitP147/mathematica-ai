import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Exclude supabase functions folder from Next.js compilation
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    config.module.rules.push({
      test: /supabase[/\\]functions/,
      loader: 'ignore-loader'
    });

    return config;
  },
  // Exclude supabase folder from transpilation
  transpilePackages: [],
};

export default nextConfig;
