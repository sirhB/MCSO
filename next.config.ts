import type { NextConfig } from "next";
import "./src/lib/runtime-env";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  webpack: (config, { nextRuntime }) => {
    // Hostinger/Next Edge instrumentation compile must not resolve Node builtins
    // pulled in by runtime-env / ensure-owner.
    if (nextRuntime === "edge") {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "@/lib/runtime-env": false,
        "@/lib/ensure-owner": false,
        "@/lib/prisma": false,
        "@/lib/backup": false,
        "@/lib/ensure-gallery": false,
        "./instrumentation-node": false,
      };
    }
    return config;
  },
};

export default nextConfig;
