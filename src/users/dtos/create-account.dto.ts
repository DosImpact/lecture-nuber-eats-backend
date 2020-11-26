import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { CoreOutput } from "src/common/dtos/output.dto"


@InputType()
export class CreateAccountInput extends PickType(User, ["email", "password", "role"]) {

}

@ObjectType() // 데코레이터가 붙은상태로 extends를 해야한다.
export class CreateAccountOutput extends CoreOutput { }