import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  phoneNumber: string;
}
