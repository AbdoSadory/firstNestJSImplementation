import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
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

  /**
   * destructuring the required data from the request body
   * check if the user already exists in the database using the email
   * if exists return error email is already exists
   * password hashing
   * create new document in the database
   * return the response
   */
  async signUpService(body: any) {
    const { name, email, password } = body;
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

  async signInService(body: any) {
    const { email, password } = body;

    //find User
    const user = await this.userModel.findOne({
      email,
      isEmailVerified: true,
    });
    if (!user) {
      throw new ConflictException(
        "Invalid login credentails or email isn't verified",
      );
    }
    // check password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login credentails');
    }

    // generate login token
    const token = this.jwt.sign(
      { email, _id: user._id },
      { secret: 'LoggedInUser', expiresIn: '1d' },
    );

    return token;
  }

  /**
   * destructuring token from the request query
   * verify the token
   * get user by email , isEmailVerified = false
   * if not return error user not found
   * if found
   * update isEmailVerified = true
   * return the response
   */
  async verifyEmailService(query: any) {
    const { token } = query;

    let decodedData: { email: string; iat: number };
    try {
      decodedData = this.jwt.verify(token, {
        secret: 'welcomeT0OurNestJS',
      });
      console.log(decodedData);
    } catch (err) {
      throw new BadRequestException(err.message);
    }

    // get uset by email , isEmailVerified = false
    const user = await this.userModel.findOneAndUpdate(
      {
        email: decodedData.email,
        isEmailVerified: false,
      },
      { isEmailVerified: true },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException("User hasn't been found");
    }

    return user;
  }
}
