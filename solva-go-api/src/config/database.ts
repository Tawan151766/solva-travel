import { DataSource } from 'typeorm';
import { config } from '../config/env';

// Import all entities
import {
  User,
  TravelPackage,
  StaffProfile,
  Booking,
  CustomTourRequest,
  Review,
  Gallery,
} from '@/entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [
    User,
    StaffProfile,
    TravelPackage,
    Booking,
    CustomTourRequest,
    Review,
    Gallery,
  ],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: ['src/database/subscribers/*.ts'],
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
    
    if (config.database.synchronize) {
      console.log('⚠️  Database synchronization is enabled');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
};

export default AppDataSource;