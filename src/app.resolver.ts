import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { GqlAuthGuard } from './auth/gql-auth.guard'
import { IdTokenUser } from './auth/jwt.strategy'
import { CurrentUser } from './utils/decorators/current-user'
import { AppService } from './app.service'

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  getHello(@CurrentUser() user: IdTokenUser): string {
    return this.appService.getHello(user)
  }
}
