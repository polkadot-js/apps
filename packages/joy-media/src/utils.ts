import { queryToProp } from '@polkadot/joy-utils/index';

export const queryMediaToProp = (storageItem: string, paramName?: string) => {
  return queryToProp(`query.media.${storageItem}`, paramName);
};
