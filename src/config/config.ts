export default () => ({
  port: parseInt(process.env.PORT || '8001', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretjwtkey',
    lifeTime: process.env.JWT_LIFE_TIME || '1h',
    resetTokenLifeTime: process.env.JWT_RESET_TOKEN_LIFE_TIME || '15m',
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'appdb',
  },
  ALLOW_INTROSPECTION: process.env.ALLOW_INTROSPECTION === 'true',
});