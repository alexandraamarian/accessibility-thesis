import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER || 'thesis',
      password: process.env.DB_PASSWORD || 'thesis_dev_pwd',
      database: process.env.DB_NAME || 'adaptive_ui',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // ONLY for development - disable in production
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
