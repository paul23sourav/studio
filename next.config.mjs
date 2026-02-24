/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.firebase.studio'],
    },
  },
};

export default nextConfig;
