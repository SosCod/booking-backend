/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    const databaseUrl = config.get<string>('DATABASE_URL');

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    if (databaseUrl) {
      // Mask password and user for security in logs
      const maskedUrl = databaseUrl
        .replace(/:([^@]+)@/, ':****@')
        .split('@')[1];
      console.log(
        `✅ DATABASE_URL detected. Connecting to host: ${maskedUrl?.split('/')[0]}`,
      );
    } else {
      console.error('❌ DATABASE_URL NOT FOUND in environment variables!');
    }
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🚀 Database connected successfully.');
    } catch (error) {
      console.error('❌ Error connecting to database:', error.message);
    }
  }
}
