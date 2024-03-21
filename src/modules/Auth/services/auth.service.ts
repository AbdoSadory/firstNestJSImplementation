import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}
  serviceOne(): string {
    return 'service one';
  }
}
