import { Request, Role } from './types';

export type ComponentProps = {
  actorAccountIds: Array<string>,
  requests: Array<Request>
  roles: Array<Role>,
};
