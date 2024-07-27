import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from './auth.decorator';
import { UserService } from '../..//domain/user/user.service';
import { RegisterRequest } from './auth.request.dto';

@Controller('/auth')
export class AuthController {
  constructor(private userService: UserService) { }

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterRequest) {
    await this.userService.create(await request.to_domain());
  }
}

