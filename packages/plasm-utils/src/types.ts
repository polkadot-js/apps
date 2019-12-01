/* eslint-disable @typescript-eslint/camelcase */
// @ts-check
// Import the API
import { Struct, u128, bool } from '@polkadot/types';
import { registry } from '@polkadot/react-api';

export class Parameters extends Struct {
	constructor (value?: any) {
    super(registry, {
      canBeNominated: 'bool',
      optionExpired: 'u128',
      optionP: 'u128'
    }, value)
  }
  static default(): Parameters {
    return new Parameters({
      canBeNominated: new bool(registry,true),
      optionExpired: new u128(registry, 0),
      optionP: new u128(registry, 0)
    });
  }
  public isError(): boolean {
    return false;
  }
}

export const types = {
  Parameters: {
    canBeNominated: 'bool',
    optionExpired: 'u128',
    optionP: 'u128'
  },
};