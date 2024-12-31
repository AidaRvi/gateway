import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('/contacts')
export class AppController {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  createContact(@Body() data: CreateContactDto): Observable<any> {
    const result = this.client.send('create-contact', data);
    console.log('"create-contact" sent to Contacts');
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
    return result;
  }
}
