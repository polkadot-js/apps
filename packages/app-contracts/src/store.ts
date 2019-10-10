// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { CodeJson, CodeStored } from './types';

import EventEmitter from 'eventemitter3';
import store from 'store';
import { Abi } from '@polkadot/api-contract';
import { createType } from '@polkadot/types';
import { api } from '@polkadot/react-api';

const KEY_CODE = 'code:';

class Store extends EventEmitter {
  private allCode: Record<string, CodeStored> = {};

  public get hasCode (): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  public getAllCode (): CodeStored[] {
    return Object.values(this.allCode);
  }

  public getCode (codeHash: string): CodeStored {
    return this.allCode[codeHash];
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async saveCode (codeHash: string | Hash, partial: Partial<CodeJson>): Promise<void> {
    const hex = (typeof codeHash === 'string' ? createType('Hash', codeHash) : codeHash).toHex();

    const existing = this.getCode(hex);

    const json = {
      ...(existing ? existing.json : {}),
      ...partial,
      codeHash: hex,
      genesisHash: api.genesisHash.toHex()
    };

    store.set(`${KEY_CODE}${json.codeHash}`, json);

    this.addCode(json as CodeJson);
  }

  public forgetCode (codeHash: string): void {
    store.remove(`${KEY_CODE}${codeHash}`);

    this.removeCode(codeHash);
  }

  public async loadAll (): Promise<void> {
    try {
      await api.isReady;

      const genesisHash = api.genesisHash.toHex();

      store.each((json: CodeJson, key: string): void => {
        if (json && json.genesisHash !== genesisHash) {
          return;
        }

        if (key.startsWith(KEY_CODE)) {
          this.addCode(json);
        }
      });
    } catch (error) {
      console.error('Unable to load code', error);
    }
  }

  private addCode (json: CodeJson): void {
    try {
      const abi = json.abi ? JSON.parse(json.abi) : null;
      this.allCode[json.codeHash] = {
        json,
        contractAbi: abi
          ? new Abi(abi)
          : undefined
      };

      this.emit('new-code');
    } catch (error) {
      console.error(error);
    }
  }

  private removeCode (codeHash: string): void {
    try {
      delete this.allCode[codeHash];
      this.emit('removed-code');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
