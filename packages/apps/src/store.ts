// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIPre } from '@polkadot/api-contract/types';
import { CodeJson, CodeStored } from './types';

import EventEmitter from 'eventemitter3';
import { nanoid } from 'nanoid';
import store from 'store';
import { Abi } from '@polkadot/api-contract';
import { api, registry } from '@canvas-ui/react-api';

const KEY_CODE = 'code:';

function newId (): string {
  return nanoid(6);
}

class Store extends EventEmitter {
  private allCode: Record<string, CodeStored> = {};

  private hashToId: Record<string, string> = {};

  public get hasCode (): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  public isHashSaved (codeHash: string): boolean {
    return !!this.hashToId[codeHash];
  }

  public isReady = false;

  public getAllCode (): CodeStored[] {
    return Object.values(this.allCode);
  }

  public getCode (id: string): CodeStored | null {
    return this.allCode[id] || null;
  }

  // public getCodeFromHash (codeHash: string): CodeStored {
  //   return this.allCode[shortId(codeHash)];
  // }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async saveCode (code: Pick<CodeJson, never>, anId?: string): Promise<string> {
    const id = anId || newId();
    const existing = anId ? this.getCode(anId) : null;

    const json = {
      ...(existing ? existing.json : {}),
      ...code,
      genesisHash: api.genesisHash.toHex()
    };

    store.set(`${KEY_CODE}${id || newId()}`, json);

    this.addCode(id, json as CodeJson);

    return id;
  }

  public forgetCode (id: string): void {
    store.remove(`${KEY_CODE}${id}`);

    this.removeCode(id);
  }

  // public forgetCodeByHash (codeHash: string): void {
  //   const id = shortId(codeHash);

  //   store.remove(`${KEY_CODE}${id}`);
  //   this.removeCode(id);
  // }

  public async loadAll (): Promise<void> {
    try {
      await api.isReady;

      const genesisHash = api.genesisHash.toHex();

      store.each((json: CodeJson, key: string): void => {
        if (json && json.genesisHash !== genesisHash) {
          return;
        }

        if (key.startsWith(KEY_CODE)) {
          const id = key.split(':')[1];

          this.addCode(id, json);
          this.hashToId[json.codeHash] = id;
        }
      });
    } catch (error) {
      console.error('Unable to load code', error);
    }
  }

  private addCode (id: string, json: CodeJson): void {
    try {
      const abi = json.abi
        ? JSON.parse(json.abi) as ContractABIPre
        : null;

      this.hashToId[json.codeHash] = id;
      this.allCode[id] = {
        contractAbi: abi
          ? new Abi(registry, abi)
          : undefined,
        id,
        json
      };

      this.emit('new-code');
    } catch (error) {
      console.error(error);
    }
  }

  private removeCode (id: string): void {
    try {
      const { json: { codeHash } } = this.allCode[id];

      delete this.hashToId[codeHash];
      delete this.allCode[id];
      this.emit('removed-code');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
