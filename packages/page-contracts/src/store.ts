// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';
import type { CodeJson, CodeStored } from './types.js';

import { EventEmitter } from 'eventemitter3';
import store from 'store';

import { Abi } from '@polkadot/api-contract';
import { statics } from '@polkadot/react-api/statics';
import { isString } from '@polkadot/util';

const KEY_CODE = 'code:';

class Store extends EventEmitter {
  #allCode: Record<string, CodeStored> = {};

  public get hasCode (): boolean {
    return Object.keys(this.#allCode).length !== 0;
  }

  public getAllCode (): CodeStored[] {
    return Object.values(this.#allCode);
  }

  public getCode (codeHash: string): CodeStored | undefined {
    return this.#allCode[codeHash];
  }

  public saveCode (_codeHash: string | Hash, partial: Partial<CodeJson>): void {
    const codeHash = (isString(_codeHash) ? statics.api.registry.createType('Hash', _codeHash) : _codeHash).toHex();
    const existing = this.getCode(codeHash);
    const json = {
      ...(existing ? existing.json : {}),
      ...partial,
      codeHash,
      genesisHash: statics.api.genesisHash.toHex(),
      whenCreated: existing?.json.whenCreated || Date.now()
    };
    const key = `${KEY_CODE}${json.codeHash}`;

    store.set(key, json);
    this.addCode(key, json as CodeJson);
  }

  public forgetCode (codeHash: string): void {
    this.removeCode(`${KEY_CODE}${codeHash}`, codeHash);
  }

  public loadAll (onLoaded?: () => void): void {
    try {
      const genesisHash = statics.api.genesisHash.toHex();

      store.each((json: CodeJson, key: string): void => {
        if (json && json.genesisHash === genesisHash && key.startsWith(KEY_CODE)) {
          this.addCode(key, json);
        }
      });

      onLoaded && onLoaded();
    } catch (error) {
      console.error('Unable to load code', error);
    }
  }

  private addCode (key: string, json: CodeJson): void {
    try {
      this.#allCode[json.codeHash] = {
        contractAbi: json.abi
          ? new Abi(json.abi, statics.api.registry.getChainProperties())
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
      delete this.#allCode[codeHash];
      store.remove(key);
      this.emit('removed-code');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
