import { IsNotEmpty } from 'class-validator';
import { NewUser } from '../../domain/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  public async to_domain(): Promise<NewUser> {
    return NewUser.from_clear_credentitals(this.username, this.password);
  }
}
