import { Controller, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { RedisService } from './redis/redis.service';

@Controller('/contacts')
export class AppController {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async createContact(
    @Body() data: CreateContactDto,
    @Req() req: any,
  ): Promise<Observable<any>> {
    const correlationId = req.correlationId;
    const result = this.client.send('create-contact', {
      ...data,
      correlationId,
    });
    console.log('"create-contact" sent to Contacts');

    await this.redisService.setData(correlationId, 'initialized');
    await this.redisService.saveCommand(`create`, correlationId);

    return result;
  }

  @Patch(':id')
  async updateContact(
    @Param('id') id: string,
    @Body() data: UpdateContactDto,
    @Req() req: any,
  ): Promise<Observable<any>> {
    const correlationId = req.correlationId;
    const result = this.client.send('update-contact', {
      id,
      ...data,
      correlationId,
    });
    console.log('"update-contact" sent to Contacts');

    await this.redisService.setData(correlationId, 'initialized');
    await this.redisService.saveCommand(`update`, correlationId);

    return result;
  }
}
