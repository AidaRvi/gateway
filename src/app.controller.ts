import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
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
  async createContact(@Body() data: CreateContactDto, @Req() req: any) {
    const correlationId = req.correlationId;

    try {
      await this.redisService.setData(correlationId, 'initialized');

      const result = await firstValueFrom(
        this.client.send('create-contact', {
          ...data,
          correlationId,
        }),
      );

      console.log('"create-contact" sent to Contacts');

      return result;
    } catch (error) {
      throw new HttpException(
        {
          correlationId,
          message: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async updateContact(
    @Param('id') id: string,
    @Body() data: UpdateContactDto,
    @Req() req: any,
  ): Promise<Observable<any>> {
    const correlationId = req.correlationId;

    try {
      await this.redisService.setData(correlationId, 'initialized');

      const result = await firstValueFrom(
        this.client.send('update-contact', {
          id,
          ...data,
          correlationId,
        }),
      );
      console.log('"update-contact" sent to Contacts');

      return result;
    } catch (error) {
      throw new HttpException(
        {
          correlationId,
          message: error.message || 'Internal Server Error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
