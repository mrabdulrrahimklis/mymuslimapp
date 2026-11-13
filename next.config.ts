import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The stylesheet is small (~7 KB gzipped): inline it rather than block the first paint on it.
  experimental: { inlineCss: true },
};

export default nextConfig;
