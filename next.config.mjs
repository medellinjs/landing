import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  // Silence Dart Sass deprecation warnings coming from 3rd-party SCSS (e.g. @payloadcms/ui)
  // related to legacy `@import` usage.
  sassOptions: {
    silenceDeprecations: ['import'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      ...(process.env.S3_PUBLIC_HOSTNAME
        ? [
            {
              protocol: 'https',
              hostname: process.env.S3_PUBLIC_HOSTNAME,
            },
          ]
        : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
