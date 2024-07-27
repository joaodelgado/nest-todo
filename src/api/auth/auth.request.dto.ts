import { IsNotEmpty } from 'class-validator';
import { NewUser } from '../../domain/user/user.entity';

export class RegisterRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  public async to_domain(): Promise<NewUser> {
    return NewUser.from_clear_credentitals(this.username, this.password);
  }
}
