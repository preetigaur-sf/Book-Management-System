import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';

export class AuthorizationProvider implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const user = authorizationCtx.principals[0];

    if (!user) {
      return AuthorizationDecision.DENY;
    }

    const allowedRoles = metadata.allowedRoles ?? [];

    if (allowedRoles.length === 0) {
      return AuthorizationDecision.ALLOW;
    }

    if (allowedRoles.includes((user as any).role)) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}