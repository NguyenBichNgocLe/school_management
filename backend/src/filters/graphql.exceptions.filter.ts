import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import {
  GqlArgumentsHost,
  GqlExceptionFilter
} from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    return new GraphQLError(exception.message, {
      extensions: {
        errorCode: exception.getResponse()['error'] || 'Internal Server Error',
        devMessage: exception.message || 'Internal Server Error',
        data: GqlArgumentsHost.create(host).getArgs(),
      },
    });
  }
}
