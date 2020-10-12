// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash } from '@polkadot/types/interfaces';
import { CodeJson, CodeStored } from './types';

import EventEmitter from 'eventemitter3';
import store from 'store';
import { Abi } from '@polkadot/api-contract';
import { api, registry } from '@polkadot/react-api';
import { createType } from '@polkadot/types';

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
    const hex = (typeof codeHash === 'string' ? createType(registry, 'Hash', codeHash) : codeHash).toHex();
    const existing = this.getCode(hex);
    const json = {
      ...(existing ? existing.json : {}),
      ...partial,
      codeHash: hex,
      genesisHash: api.genesisHash.toHex()
    };
    const key = `${KEY_CODE}${json.codeHash}`;

    store.set(key, json);
    this.addCode(key, json as CodeJson);
  }

  public forgetCode (codeHash: string): void {
    this.removeCode(`${KEY_CODE}${codeHash}`, codeHash);
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
          this.addCode(key, json);
        }
      });
    } catch (error) {
      console.error('Unable to load code', error);
    }
  }

  private addCode (key: string, json: CodeJson): void {
    try {
      this.allCode[json.codeHash] = {
        contractAbi: json.abi
          ? new Abi(json.abi)
          : undefined,
        json
      };

      this.emit('new-code');
    } catch (error) {
      console.error(error);
      this.removeCode(key, json.codeHash);
    }
  }

  private removeCode (key: string, codeHash: string): void {
    try {
      delete this.allCode[codeHash];
      store.remove(key);
      this.emit('removed-code');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
