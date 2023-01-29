import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]
  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2 || options.password.length <= 2) {
      return {
        errors: [{
          field: 'username',
          message: 'username or password length too short'
        }]
      }
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = ctx.emFork.create(User, { username: options.username, password: hashedPassword })
    try {
      await ctx.emFork.persistAndFlush(user);
    } catch (err) {
      // duplicate username error
      if (err.code === '23505' || err.detail.includes('already exists')) {
        return {
          errors: [{
            field: 'username',
            message: 'username already exists'
          }]
        }
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    // lookup user
    const user = await ctx.emFork.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'could not find that username'
        }]
      }
    }

    const validPassword = await argon2.verify(user.password, options.password);
    if (!validPassword) {
      return {
        errors: [{
          field: 'password',
          message: 'invalid login'
        }]
      }
    }
    // we have found a user and thier password is correct
    return { user };
  }
}