import { IsNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsNumber()
  phoneNumber: string;
}
