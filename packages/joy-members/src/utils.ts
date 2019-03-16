import { queryToProp } from '@polkadot/joy-utils/index';

export const queryMembershipToProp = (storageItem: string, paramName?: string) => {
  return queryToProp(`query.membership.${storageItem}`, paramName);
};
