import {inject} from '@loopback/core';
import {AuthenticationBindings, AuthenticateFn} from 'loopback4-authentication';

import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
  UserPermissionsFn,
} from 'loopback4-authorization';

import {
  FindRoute,
  HttpErrors,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';

import {User} from './models';

const SequenceActions = RestBindings.SequenceActions;

export class AuthSequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE)
    protected findRoute: FindRoute,

    @inject(SequenceActions.PARSE_PARAMS)
    protected parseParams: ParseParams,

    @inject(SequenceActions.INVOKE_METHOD)
    protected invoke: InvokeMethod,

    @inject(SequenceActions.INVOKE_MIDDLEWARE)
    protected invokeMiddleware: InvokeMiddleware,

    @inject(SequenceActions.SEND)
    public send: Send,

    @inject(SequenceActions.REJECT)
    public reject: Reject,

    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn<User>,

    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,

    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getUserPermissions: UserPermissionsFn<string>,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const finished = await this.invokeMiddleware(context);

      if (finished) {
        return;
      }

      const route = this.findRoute(request);

      const args = await this.parseParams(request, route);

      request.body = args[args.length - 1];

      const authUser = await this.authenticateRequest(request);

      if (authUser) {
        const permissions = this.getUserPermissions(
          authUser.permissions ?? [],
          (authUser as any).role?.permissions ?? [],
        );

        console.log('Required Route:', request.path);
        console.log('Auth User Permissions:', authUser?.permissions);
        const isAccessAllowed: boolean = await this.checkAuthorisation(
          permissions,
          request,
        );

        if (!isAccessAllowed) {
          throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
        }
      }

      const result = await this.invoke(route, args);

      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}
