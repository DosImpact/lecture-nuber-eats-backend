import { Field, ObjectType } from "@nestjs/graphql";

// 데코레이터가 붙은상태로 extends를 해야한다.
@ObjectType()
export class MutationOutput {
    @Field(type => String, { nullable: true })
    error?: string;

    @Field(type => Boolean)
    ok: boolean;
}