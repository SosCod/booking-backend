/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });

    if (config.get('DATABASE_URL')) {
      console.log('✅ DATABASE_URL detected in environment.');
    } else {
      console.error('❌ DATABASE_URL NOT FOUND in environment variables!');
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🚀 Database connected successfully.');
    } catch (e) {
      console.error('❌ Error connecting to database:', e.message);
    }
  }
}
