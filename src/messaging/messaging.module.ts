import { Global, Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { AuditService } from '../audit/audit.service';

@Global()
@Module({
  providers: [RabbitmqService, AuditService],
  exports: [RabbitmqService, AuditService],
})
export class MessagingModule {}
