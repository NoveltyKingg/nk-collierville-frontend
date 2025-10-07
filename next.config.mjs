import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['noveltykingmedia.s3.us-east-2.amazonaws.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [require.resolve('@svgr/webpack')],
    })

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }

    return config
  },
}

export default nextConfig
