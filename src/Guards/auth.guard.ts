import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<object> {
    const req = context.switchToHttp().getRequest();
    const { accesstoken } = req.headers;
    if (!accesstoken) {
      throw new BadRequestException('pleaee lognIn first');
    }
    if (!accesstoken.startsWith('nest__')) {
      throw new BadRequestException('wrong prefix');
    }
    const token = accesstoken.split('__')[1];

    const decodedData = this.jwt.verify(token, {
      secret: 'LoggedInUser',
    });

    if (!decodedData._id) {
      throw new BadRequestException('wrong token');
    }
    const user = await this.userModel.findById(decodedData._id, 'email name');
    if (!user) {
      throw new BadRequestException('please signup first');
    }
    req.authUser = user;
    return req;
  }
}
