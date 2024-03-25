import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/Guards/auth.guard';
import { upadateBodyDTO } from '../user.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async myProfileController(@Req() req: Request, @Res() res: Response) {
    const response = await this.userService.myProfileService(req);
    res.status(200).json({ message: 'User Profile', profile: response });
  }
  @Put('')
  async updateController(
    @Req() req: Request,
    @Body() body: upadateBodyDTO,
    @Res() res: Response,
  ) {
    const response = await this.userService.updateService(req, body);
    res
      .status(200)
      .json({ message: 'User Profile has been updated', profile: response });
  }
  @Delete('')
  async deleteController(@Req() req: Request, @Res() res: Response) {
    const response = await this.userService.deleteService(req);
    res
      .status(200)
      .json({ message: 'User has been deleted successfully', response });
  }
}
