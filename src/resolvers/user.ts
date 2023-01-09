import { User } from "src/entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() ctx: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = ctx.emFork.create(User, { username: options.username, password: hashedPassword })
    await ctx.emFork.persistAndFlush(user);
    return user;
  }
}