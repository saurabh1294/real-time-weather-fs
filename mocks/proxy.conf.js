

const BASE_PROXY_CONFIG = {
  target: 'http://localhost:3456',
  logLevel: 'debug',
  secure: false,
  agent: false,
  changeOrigin: true,
  autoRewrite: true,
  protocolRewrite: 'http'
};
const CONTEXT = 'rtweatherAPIHost';

const CONFIG = {
  [`/${CONTEXT}/public/api`]: BASE_PROXY_CONFIG,
};

module.exports = CONFIG;
