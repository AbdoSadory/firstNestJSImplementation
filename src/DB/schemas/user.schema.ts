import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    tirm: true,
    lowercase: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    tirm: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 8,
  })
  password: string;

  @Prop({
    type: Number,
    min: 18,
    max: 100,
  })
  age: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
