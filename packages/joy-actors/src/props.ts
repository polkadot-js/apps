import { Request, Role } from './types';

export type ComponentProps = {
  actors: Array<string>,
  requests: Array<Request>
  roles: Array<Role>,
};
