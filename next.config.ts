import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob — where the Media Library stores uploaded images.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB. Raised to cover the Contact/Request-a-Quote forms'
      // attachment upload (10MB file limit — src/lib/media/upload.ts —
      // plus multipart overhead and the rest of the form fields).
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
