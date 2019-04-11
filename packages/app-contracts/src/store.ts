// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeJson, ContractJson } from './types';

import EventEmitter from 'eventemitter3';
import store from 'store';
import { AccountId, ContractAbi, Hash } from '@polkadot/types';
import { api } from '@polkadot/ui-api';

const PREFIX = 'contract:';
const KEY_CODE = `${PREFIX}code:`;
const KEY_CONTRACT = `${PREFIX}addr:`;

const codeRegex = new RegExp(`^${KEY_CODE}`, '');
const contractRegex = new RegExp(`^${KEY_CONTRACT}`, '');

type CodeStored = { json: CodeJson , contractAbi?: ContractAbi };
type ContractStored = { json: ContractJson , contractAbi: ContractAbi };

class Store extends EventEmitter {
  private allCode: { [index: string]: CodeStored } = {};
  private allContracts: { [index: string]: ContractStored } = {};

  get hasCode (): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  get hasContracts (): boolean {
    return Object.keys(this.allContracts).length !== 0;
  }

  getAllCode (): Array<CodeStored> {
    return Object.values(this.allCode);
  }

  getAllContracts (): Array<ContractStored> {
    return Object.values(this.allContracts);
  }

  getCode (codeHash: string): CodeStored {
    return this.allCode[codeHash];
  }

  getContract (address: string): ContractStored {
    return this.allContracts[address];
  }

  async saveCode (codeHash: Hash, partial: Partial<CodeJson>) {
    await api.isReady;

    const json = {
      ...partial,
      codeHash: codeHash.toHex(),
      genesisHash: api.genesisHash.toHex()
    } as CodeJson;

    store.set(`${KEY_CODE}${json.codeHash}`, json);

    this.addCode(json);
  }

  async saveContract (address: AccountId, partial: Partial<ContractJson>) {
    await api.isReady;

    const json = {
      ...partial,
      address: address.toString(),
      genesisHash: api.genesisHash.toHex()
    } as ContractJson;

    store.set(`${KEY_CONTRACT}${address}`, json);

    this.addContract(json);
  }

  async loadAll () {
    try {
      await api.isReady;

      const genesisHash = api.genesisHash.toHex();

      store.each((json: CodeJson | ContractJson, key: string) => {
        if (json && json.genesisHash !== genesisHash) {
          return;
        }

        if (codeRegex.test(key)) {
          this.addCode(json as CodeJson);
        } else if (contractRegex.test(key)) {
          this.addContract(json as ContractJson);
        }
      });
    } catch (error) {
      console.error('Unable to load contracts', error);
    }
  }

  private addCode (json: CodeJson) {
    try {
      this.allCode[json.codeHash] = {
        json,
        contractAbi: json.abi
          ? new ContractAbi(JSON.parse(json.abi))
          : undefined
      };

      this.emit('new-code');
    } catch (error) {
      console.error(error);
    }
  }

  private addContract (json: ContractJson) {
    try {
      this.allContracts[json.address] = {
        json,
        contractAbi: new ContractAbi(JSON.parse(json.abi))
      };

      this.emit('new-contract');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
