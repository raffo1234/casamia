import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://img.freepik.com/free-vector/**"),
      new URL(
        "https://bzhqohtiptcvesotbvgh.supabase.co/storage/v1/object/public/**"
      ),
      new URL(
        "https://lh3.googleusercontent.com/a/ACg8ocIF21l18edytBuCI8PEKxTQMdiFFtP5UUCbhk0-dr5t8TjwATHg=s96-c/**"
      ),
    ],
  },
};

export default nextConfig;
