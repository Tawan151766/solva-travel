import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from '../config/env';

const resetDatabase = async () => {
  // Create a connection without specifying entities to avoid circular dependency issues
  const dataSource = new DataSource({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Drop all tables
    await dataSource.query('DROP SCHEMA public CASCADE');
    console.log('🗑️  Dropped all tables');

    // Recreate schema
    await dataSource.query('CREATE SCHEMA public');
    console.log('🆕 Created new schema');

    await dataSource.destroy();
    console.log('✅ Database reset completed');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();