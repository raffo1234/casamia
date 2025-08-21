import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/free-vector/**",
      },
      {
        protocol: "https",
        hostname: "bzhqohtiptcvesotbvgh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "googleusercontent.com",
        pathname: "/profile/picture/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        pathname: "/id/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
