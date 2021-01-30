import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

// const logger = new Logger('AuthUser');

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    // logger.log(JSON.stringify(user));
    return user;
  },
);
