import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisModule } from './redis/redis.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Module({
  imports: [
    RedisModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'contacts',
          queueOptions: {
            durable: false,
          },
          noAck: true,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
