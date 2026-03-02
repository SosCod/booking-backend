import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid auth header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Try verifying with Admin Secret Key first
      let verifiedToken;
      try {
        verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });
      } catch (adminError) {
        // If Admin verification fails, try Client Secret Key
        try {
          verifiedToken = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY_CLIENT,
          });
        } catch (clientError) {
          // If both fail, throw unauthorized
          console.error('Clerk verification failed for both keys');
          throw new UnauthorizedException('Authentication failed');
        }
      }

      const clerkId = verifiedToken.sub;

      // Buscar el usuario en la BD para obtener su rol real
      const dbUser = await this.prisma.user.findUnique({
        where: { clerkId },
      });

      request.user = {
        clerkId,
        email: dbUser?.email || (verifiedToken as any).email,
        role: dbUser?.role || 'client',
      };

      return true;
    } catch (error) {
      console.error('Clerk verification error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
