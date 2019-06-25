// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeJson, CodeStored } from './types';

import EventEmitter from 'eventemitter3';
import store from 'store';
import { Abi } from '@polkadot/api-contract';
import { Hash } from '@polkadot/types';
import { api } from '@polkadot/ui-api';

const KEY_CODE = 'code:';

const codeRegex = new RegExp(`^${KEY_CODE}`, '');

class Store extends EventEmitter {
  private allCode: { [index: string]: CodeStored } = {};

  get hasCode (): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  getAllCode (): Array<CodeStored> {
    return Object.values(this.allCode);
  }

  getCode (codeHash: string): CodeStored {
    return this.allCode[codeHash];
  }

  async saveCode (codeHash: string | Hash, partial: Partial<CodeJson>) {
    const hex = (typeof codeHash === 'string' ? new Hash(codeHash) : codeHash).toHex();

    const existing = this.getCode(hex);

    const json = {
      ...(existing ? existing.json : {}),
      ...partial,
      codeHash: hex,
      genesisHash: api.genesisHash.toHex()
    } as CodeJson;

    store.set(`${KEY_CODE}${json.codeHash}`, json);

    this.addCode(json);
  }

  forgetCode (codeHash: string) {
    store.remove(`${KEY_CODE}${codeHash}`);

    this.removeCode(codeHash);
  }

  async loadAll () {
    try {
      await api.isReady;

      const genesisHash = api.genesisHash.toHex();

      store.each((json: CodeJson, key: string) => {
        if (json && json.genesisHash !== genesisHash) {
          return;
        }

        if (codeRegex.test(key)) {
          this.addCode(json);
        }
      });
    } catch (error) {
      console.error('Unable to load code', error);
    }
  }

  private addCode (json: CodeJson) {
    try {
      this.allCode[json.codeHash] = {
        json,
        contractAbi: json.abi
          ? new Abi(JSON.parse(json.abi))
          : undefined
      };

      this.emit('new-code');
    } catch (error) {
      console.error(error);
    }
  }

  private removeCode (codeHash: string) {
    try {
      delete this.allCode[codeHash];
      this.emit('removed-code');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
