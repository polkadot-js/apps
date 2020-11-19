import { RegistryTypes } from '@polkadot/types/types';
import * as metaBlockchainDefs from '../interfaces/definitions';

const metaBlockchainTypes = Object
  .values(metaBlockchainDefs)
  .reduce((res, { types }) => ({ ...res, ...types }), {});

const types: RegistryTypes = {
  ...metaBlockchainTypes
};

export default {
  types
};
