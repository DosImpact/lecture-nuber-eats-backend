import { Field, ObjectType } from "@nestjs/graphql";

// Mutation 시에  error와 ok 라는 성공메시지는 공통사용 > 
@ObjectType() // 데코레이터가 붙은상태로 extends를 해야한다.
export class CoreOutput {
    @Field(type => String, { nullable: true })
    error?: string;

    @Field(type => Boolean)
    ok: boolean;
}