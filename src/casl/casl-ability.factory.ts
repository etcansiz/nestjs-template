import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { Article } from 'src/articles/schemas/articles.model'
import { User } from 'src/users/schemas/users.model'

import { ArticleAbilities } from './abilities/article.abilities'

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<typeof Article | typeof User> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const ability = new AbilityBuilder<AppAbility>(
      Ability as AbilityClass<AppAbility>,
    )
    const { can, build } = ability

    if (user.isAdmin) can(Action.Manage, 'all')
    else can(Action.Read, 'all')

    // Add all abilities
    ArticleAbilities(ability, user)
    // cannot(Action.Delete, Article, { isPublished: false })

    // Abilities can also be loaded from your database, either by general roles (RBAC) or
    // property based

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}