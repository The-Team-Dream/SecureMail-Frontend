import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/mailbox",
        permanent: true,
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
