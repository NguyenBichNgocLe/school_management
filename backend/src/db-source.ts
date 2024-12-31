import { DataSource, DataSourceOptions } from 'typeorm';
import { Class } from './class/entities/class.entity';
import { Student } from './student/entities/student.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const DbConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get('DB_USER', 'postgres'),
  password: configService.get('DB_PASSWORD', 'Password0.'),
  database: configService.get('DB_NAME', 'postgres'),
  entities: [Class, Student],
  synchronize: false,
  migrations: ['migrations/*.ts'],
};

const AppDataSource = new DataSource(DbConfig);
export default AppDataSource;
