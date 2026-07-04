/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true }, // هذا كان موجود عندك
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
    ]
  },
}

export default nextConfig;