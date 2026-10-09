import {DataSource} from 'typeorm';
import 'dotenv/config';
import 'reflect-metadata';
import {User} from '../user/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User],
  synchronize: true,
});