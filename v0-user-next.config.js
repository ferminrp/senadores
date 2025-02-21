/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["raw.githubusercontent.com"],
  },
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
}

module.exports = nextConfig

