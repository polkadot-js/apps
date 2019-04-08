// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeJson, ContractJson } from './types';

import store from 'store';
import { AccountId, Hash } from '@polkadot/types';

const KEY_CODE = 'contract:code:';
const KEY_CONTRACT = 'contract:contract:';

const codeRegex = new RegExp(`^${KEY_CODE}`, '');
const contractRegex = new RegExp(`^${KEY_CONTRACT}`, '');

class Store {
  private allCode: { [index: string]: CodeJson } = {};
  private allContracts: { [index: string]: ContractJson } = {};

  constructor () {
    store.each((json: CodeJson | ContractJson, key: string) => {
      if (codeRegex.test(key)) {
        this.loadCode(json as CodeJson);
      } else if (contractRegex.test(key)) {
        this.loadContract(json as ContractJson);
      }
    });
  }

  get hasCode (): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  get hasContracts (): boolean {
    return Object.keys(this.allContracts).length !== 0;
  }

  getAllCode (): Array<CodeJson> {
    return Object.values(this.allCode);
  }

  getAllContracts (): Array<ContractJson> {
    return Object.values(this.allContracts);
  }

  getCode (codeHash: string): CodeJson {
    return this.allCode[codeHash];
  }

  getContract (address: string): ContractJson {
    return this.allContracts[address];
  }

  private loadCode (json: CodeJson) {
    this.allCode[json.codeHash] = json;
  }

  private loadContract (json: ContractJson) {
    this.allContracts[json.address] = json;
  }

  saveCode (codeHash: Hash, json: Partial<CodeJson>) {
    store.set(`${KEY_CODE}${codeHash}`, { ...json, codeHash });
  }

  saveContract (address: AccountId, json: Partial<CodeJson>) {
    store.set(`${KEY_CONTRACT}${address}`, { ...json, address });
  }
}

export default new Store();
