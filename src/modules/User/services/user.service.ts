import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SendEmailService } from 'src/modules/Common/Services/send-email.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwt: JwtService,
    private readonly sendEmailService: SendEmailService,
  ) {}

  async myProfileService(req: any) {
    const { id: userId } = req.authUser;
    // check if user is existed
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ConflictException('No User with this id');
    }
    return user;
  }

  /**
   * check if user is existed
   * check if it's verified
   * update name if exists
   * check if new email is already used for another user
   * send Verification Email again to verify the new email
   * if password is send, hash Password and save it
   * update
   */
  async updateService(req: any, body: any) {
    const { name, email, password } = body;
    const { id: userId } = req.authUser;
    //Check if user existed
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('No User with this id');
    }
    // check if it's verified
    if (!user.isEmailVerified) {
      throw new ConflictException('You have to verified your account first');
    }
    //update name if exists
    name && (user.name = name);

    if (email) {
      // check if new email is already used for another user
      const isEmailExisted = await this.userModel.findOne({
        _id: { $ne: userId },
        email,
      });
      if (isEmailExisted)
        throw new ConflictException(
          'This Email is already existed for another user, try another one',
        );

      const usertoken = this.jwt.sign(
        { email },
        { secret: 'welcomeT0OurNestJS' },
      );

      const isEmailSent = await this.sendEmailService.sendEmail(
        email,
        'Email Verification',
        `
              <h2>please clich on this link to verfiy your email</h2>
              <a href="http://localhost:3000/auth/verify-email?token=${usertoken}">Verify Email</a>
              `,
      );
      // 4- check if email is sent successfully
      if (!isEmailSent) {
        throw new InternalServerErrorException(
          'Email is not sent, please try again later',
        );
      }

      user.email = email;
      user.isEmailVerified = false;
    }

    // if password is sent, hash Password and save it
    if (password) {
      const hashedNewPassword = bcrypt.hashSync(password, 10);
      user.password = hashedNewPassword;
    }

    user['__v'] += 1;

    const updatedUser = await user.save();

    return updatedUser;
  }

  async deleteService(req: any) {
    const { id: userId } = req.authUser;
    const user = await this.userModel.findOneAndDelete({
      _id: userId,
      isEmailVerified: true,
    });
    if (!user) {
      throw new BadRequestException(
        'No User with this id or you have to verified your account first',
      );
    }
    return user;
  }
}
