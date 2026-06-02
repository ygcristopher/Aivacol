import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      service: 'fleet-management-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
