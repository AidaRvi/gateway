import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
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
  createContact(@Body() data: CreateContactDto): Observable<any> {
    const result = this.client.send('create-contact', data);
    console.log('"create-contact" sent to Contacts');

    this.redisService.setData(`create:${data.id}`, 'initialized');
    this.redisService.saveCommand(`create`, data.id);

    return result;
  }

  @Patch(':id')
  updateContact(
    @Param('id') id: string,
    @Body() data: UpdateContactDto,
  ): Observable<any> {
    const result = this.client.send('update-contact', {
      id,
      ...data,
    });
    console.log('"update-contact" sent to Contacts');

    this.redisService.setData(`update:${id}`, 'initialized');
    this.redisService.saveCommand(`update`, id);

    return result;
  }
}
