/**
 * Logger minimalista e centralizado. Mantem o formato dos logs
 * consistente sem depender de uma lib externa.
 */

function timestamp() {
  return new Date().toISOString();
}

function info(message, meta) {
  console.log(`[${timestamp()}] [INFO] ${message}`, meta !== undefined ? meta : '');
}

function warn(message, meta) {
  console.warn(`[${timestamp()}] [WARN] ${message}`, meta !== undefined ? meta : '');
}

function error(message, err) {
  console.error(`[${timestamp()}] [ERROR] ${message}`, err !== undefined ? err : '');
}

module.exports = { info, warn, error };
