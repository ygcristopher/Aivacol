import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection?: amqplib.ChannelModel;
  private channel?: amqplib.Channel;
  private readonly exchange = 'fleet.events';
  private readonly logger = new Logger(RabbitmqService.name);

  async onModuleInit(): Promise<void> {
    try {
      const url =
        process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672';

      const connectWithTimeout = Promise.race([
        amqplib.connect(url),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('RabbitMQ connection timeout')),
            3000,
          ),
        ),
      ]);

      this.connection = await connectWithTimeout;
      this.channel = await this.createChannel();
      await this.assertExchange();
      this.logger.log('Connected to RabbitMQ');
    } catch (err) {
      this.logger.warn(`RabbitMQ not available: ${String(err)}`);
      this.connection = undefined;
      this.channel = undefined;
    }
  }
  private async createChannel(): Promise<amqplib.Channel> {
    if (!this.connection) {
      throw new Error('Connection not established');
    }

    return await this.connection.createChannel();
  }

  private async assertExchange(): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not established');
    }

    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true,
    });
  }

  publish(routingKey: string, payload: unknown): void {
    if (!this.channel) {
      this.logger.debug('Skipping publish, channel not available');
      return;
    }

    const buffer = Buffer.from(JSON.stringify(payload));

    this.channel.publish(this.exchange, routingKey, buffer, {
      persistent: true,
    });
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.closeChannel();
      await this.closeConnection();
      this.logger.log('RabbitMQ connection closed');
    } catch (err) {
      this.logger.warn(`Error closing RabbitMQ connection: ${String(err)}`);
    }
  }

  private async closeChannel(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
  }

  private async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
