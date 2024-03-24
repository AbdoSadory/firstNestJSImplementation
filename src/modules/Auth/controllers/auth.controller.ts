import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUpController(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.signUpService(req);
    res
      .status(200)
      .json({ message: 'User has been created successfully', user: response });
  }
}
