const { createSecureHeaders } = require('next-secure-headers')

module.exports = {
  headers: () => { return [{ source: '/(.*)', headers: createSecureHeaders() }] },
  experimental: {
    appDir: false,
  },
  transpilePackages: ['@0xsquid/widget'],
}