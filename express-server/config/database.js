import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // Database name
  process.env.DB_USERNAME,        // Username
  process.env.DB_PASSWORD,    // Password
  {
    host: process.env.DB_HOST || 'localhost', // localhost for dev
    dialect: 'mysql',         // Use 'mysql' dialect for MariaDB compatibility
    logging: false,           // Disable SQL logging (set to console.log if needed)
    dialectOptions: {
      // Optional: MariaDB specific options, if any
    }
  }
);

export default sequelize;
