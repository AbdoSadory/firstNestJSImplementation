import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SendEmailService } from 'src/modules/Common/Services/send-email.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private sendEmailService: SendEmailService,
  ) {}
  serviceOne(): string {
    return 'service one';
  }

  async signUpService(req: any) {
    const { name, email, password } = req.body;
    const isEmailExisted = await this.userModel.findOne({ email });
    if (isEmailExisted) {
      throw new ConflictException(
        'Email already exists,Please try another email',
      );
    }
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
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser)
      throw new InternalServerErrorException('Error while creating User');
    return newUser;
  }
}
