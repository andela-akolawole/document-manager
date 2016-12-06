import dotenv from 'dotenv';


if (process.env.NODE_ENV === 'development') {
  dotenv.config({ silent: true });
}

const config = {
  database: process.env.DB_NAME || 'document-manager',
  dbUsername: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  secret: process.env.SECRET,
};

export default config;
