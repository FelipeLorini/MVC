require('dotenv').config();

const REQUIRED_VARS = ['DB_HOST', 'DB_USER', 'DB_NAME', 'SESSION_SECRET'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Variaveis de ambiente obrigatorias ausentes: ${missing.join(', ')}. ` +
      'Confira o arquivo .env (veja .env.example como referencia).'
    );
  }
}

const env = {
  validateEnv,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true'
  },
  session: {
    secret: process.env.SESSION_SECRET
  }
};

module.exports = env;
