import { IsString } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  name: string;
}
