const withPlugins = require('next-compose-plugins');
const {i18n} = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18n,
  reactStrictMode: true
}

module.exports = withPlugins([], nextConfig)
