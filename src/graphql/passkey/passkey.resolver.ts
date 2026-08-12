// src\presentation\passkey\passkey.resolver.ts
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { USER_ROLE } from '../guard/userRole';
import { makeAuthGuard } from '../guard/auth.guard.factory';
import { CurrentSession } from '../guard/userSession.decorator';
import { PasskeyResolverModel } from './model/passkey.resolver.model';
import { DeletePasskeyResolverDto } from './dto/delete.passkey.resolver.dto';
import { DeletePasskeyUsecase } from '@usecases/passkey/delete.passkey.usecase';
import { CreatePasskeyUsecase } from '@usecases/passkey/create.passkey.usecase';
import { CreatePasskeyResolverDto } from './dto/passkey.register.auth.resolver.dto';
import { UserSessionResolverModel } from '../auth/model/user.session.resolver.model';
import { GetByUserIdPasskeyUsecase } from '@usecases/passkey/getByUserId.passkey.usecase';
import { OptionsAuthPasskeyUsecase } from '@usecases/passkey/options.auth.passkey.usecase';
import { OptionsRegisterPasskeyUsecase } from '@usecases/passkey/options.register.passkey.usecase';
import {
  PasskeyAuthOptionsResolverModel,
  PasskeyRegisterOptionsResolverModel,
} from './model/passkey.options.resolver.model';

@Resolver('PasskeyResolver')
export class PasskeyResolver {
  constructor(
    @Inject('Inversify')
    private inversify: {
      createPasskeyUsecase: CreatePasskeyUsecase
      deletePasskeyUsecase: DeletePasskeyUsecase
      getByUserIdPasskeyUsecase: GetByUserIdPasskeyUsecase
      optionsAuthPasskeyUsecase: OptionsAuthPasskeyUsecase
      optionsRegisterPasskeyUsecase: OptionsRegisterPasskeyUsecase
    },
  ) {}

  /**
   * Amorce une authentification. **Sans garde, et c'est tout le point** : on ne
   * peut pas exiger d'être authentifié pour obtenir de quoi s'authentifier. Sa
   * réponse ne porte donc rien qui permettrait d'énumérer les comptes.
   */
  @Query(
    /* istanbul ignore next */
    (): typeof PasskeyAuthOptionsResolverModel =>
      PasskeyAuthOptionsResolverModel,
  )
  async passkey_auth_options(): Promise<PasskeyAuthOptionsResolverModel> {
    return this.inversify.optionsAuthPasskeyUsecase.execute();
  }

  /** Amorce un enregistrement, pour la session en cours. */
  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(
    /* istanbul ignore next */
    (): typeof PasskeyRegisterOptionsResolverModel =>
      PasskeyRegisterOptionsResolverModel,
  )
  async passkey_register_options(
    @CurrentSession() session: UserSessionResolverModel,
  ): Promise<PasskeyRegisterOptionsResolverModel> {
    return this.inversify.optionsRegisterPasskeyUsecase.execute({
      user_id: session.id,
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Mutation(
    /* istanbul ignore next */
    (): typeof PasskeyResolverModel => PasskeyResolverModel,
  )
  async create_passkey(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto') dto: CreatePasskeyResolverDto,
  ): Promise<PasskeyResolverModel> {
    const response = await this.inversify.createPasskeyUsecase.execute({
      ...dto,
      user_id: session.id,
      user_code: session.code,
    });
    return {
      id: response.id,
      label: response.label,
      user_id: response.user_id,
      hostname: response.hostname,
      user_code: response.user_code,
      credential_id: response.registration.id,
      authenticator_name: response.registrationParsed?.authenticator?.name,
      synced: response.registrationParsed?.synced,
    };
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Query((returns) => [PasskeyResolverModel])
  async passkeys_for_user(
    @CurrentSession() session: UserSessionResolverModel,
  ): Promise<PasskeyResolverModel[]> {
    const entities = await this.inversify.getByUserIdPasskeyUsecase.execute({
      user_id: session.id,
    });
    return entities.map((passkey) => {
      return {
        id: passkey.id,
        label: passkey.label,
        user_id: passkey.user_id,
        hostname: passkey.hostname,
        user_code: passkey.user_code,
        credential_id: passkey.registration.id,
        // Le fournisseur et l'état de sauvegarde dormaient déjà dans
        // `registration_parsed` : les exposer ne coûte ni colonne ni migration.
        authenticator_name: passkey.registrationParsed?.authenticator?.name,
        synced: passkey.registrationParsed?.synced,
      };
    });
  }

  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  /* eslint-disable @typescript-eslint/no-unused-vars */
  @Mutation((returns) => Boolean)
  async delete_passkey(
    @CurrentSession() session: UserSessionResolverModel,
    @Args('dto') dto: DeletePasskeyResolverDto,
  ): Promise<boolean> {
    this.inversify.deletePasskeyUsecase.execute({
      ...dto,
      user_id: session.id,
    });

    return true;
  }
}
