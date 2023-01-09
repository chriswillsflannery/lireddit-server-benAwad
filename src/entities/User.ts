import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

// convert class to typeGraphQL type with ObjectType + Field's
@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Field() // expose field to graphQL schema
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  // do not expose to gql schema
  @Property({ type: 'text' })
  password!: string;
}