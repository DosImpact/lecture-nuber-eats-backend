import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext){
        // console.log(context);
        // http context 와 gql context를 다르다. 해당 context를 변경해주는과정
        const gqlContext = GqlExecutionContext.create(context).getContext();
        // console.log(gqlContext);
        const user = gqlContext['user'];
        // console.log(user);
        if(!user){
            return false
        }
        return true;
    }
}