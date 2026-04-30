import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/mailboxes",
        permanent: true,
      },
    ];
  },
  /* config options here */
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;
