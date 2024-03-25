import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { signInBodyDTO, signUpBodyDTO, verifyEmailQueryDTO } from '../auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUpController(@Body() body: signUpBodyDTO, @Res() res: Response) {
    const response = await this.authService.signUpService(body);
    res
      .status(200)
      .json({ message: 'User has been created successfully', user: response });
  }

  @Post('signIn')
  async signInController(@Body() body: signInBodyDTO, @Res() res: Response) {
    const response = await this.authService.signInService(body);
    res.status(200).json({
      message: 'User has been logged in successfully',
      token: response,
    });
  }

  @Get('verify-email')
  async verifyEmailController(
    @Query() query: verifyEmailQueryDTO,
    @Res() res: Response,
  ) {
    const response = await this.authService.verifyEmailService(query);
    res.status(200).json({
      message: 'User Email has been Verified successfully',
      token: response,
    });
  }
}
