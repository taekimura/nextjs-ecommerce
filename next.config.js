/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['antd-mobile'],
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com']
  }
};

module.exports = nextConfig;
