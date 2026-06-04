import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { MongoClient, Db, Collection } from 'mongodb';

type AuditRecord = {
  event: string;
  payload: unknown;
  createdAt: Date;
};

@Injectable()
export class AuditService implements OnModuleInit, OnModuleDestroy {
  private client?: MongoClient;
  private db?: Db;
  private collection?: Collection<AuditRecord>;
  private readonly logger = new Logger(AuditService.name);

  async onModuleInit(): Promise<void> {
    try {
      const url = process.env.MONGODB_URL ?? 'mongodb://mongo:27017';
      const dbName = process.env.MONGODB_DB ?? 'fleet';
      this.client = new MongoClient(url, {
        connectTimeoutMS: 3000,
        serverSelectionTimeoutMS: 3000,
      });
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.collection = this.db.collection<AuditRecord>('vehicle_audit');
      this.logger.log('Connected to MongoDB for audit');
    } catch (err) {
      this.logger.warn(`MongoDB not available: ${String(err)}`);
      this.client = undefined;
      this.db = undefined;
      this.collection = undefined;
    }
  }

  async record(event: string, payload: unknown): Promise<void> {
    if (!this.collection) { // CORRIJIR para dar reconnect
      this.logger.debug('Audit collection not available; skipping record');
      return;
    }

    try {
      const rec: AuditRecord = { event, payload, createdAt: new Date() };
      await Promise.race([
        this.collection.insertOne(rec),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Audit timeout')), 3000),
        ),
      ]);
    } catch (err) {
      this.logger.warn(`Audit record failed: ${String(err)}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client?.close();
      this.logger.log('MongoDB audit connection closed');
    } catch (err) {
      this.logger.warn(`Error closing MongoDB client: ${String(err)}`);
    }
  }
}
