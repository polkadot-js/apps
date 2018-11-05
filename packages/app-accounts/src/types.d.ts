import { AccountId, Address } from '@polkadot/types';

export type Actions = 'create' | 'edit' | 'restore' | 'forget';

export type ActionStatus = {
  action: Actions,
  value: AccountId | Address | string,
  success: boolean,
  message: string
};
