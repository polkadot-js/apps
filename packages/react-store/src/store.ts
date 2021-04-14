// Copyright 2017-2021 @polkadot/react-store authors & contributors
// and @canvas-ui/react-store authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Moved from @canvas-ui/apps -> @canvas-ui/react-store

import { api } from '@canvas-ui/react-api';
import EventEmitter from 'eventemitter3';
import { nanoid } from 'nanoid';
import store from 'store';

import { Code } from './types';

const KEY_CODE = 'code:';

function newId (): string {
  return nanoid(6);
}

class Store extends EventEmitter {
  private allCode: Record<string, Code> = {};

  private hashToId: Record<string, string> = {};

  public get hasCode (): boolean {
    return Object.keys(this.allCode).length !== 0;
  }

  public isHashSaved (codeHash: string): boolean {
    return !!this.hashToId[codeHash];
  }

  public isReady = false;

  public getAllCode (): Code[] {
    return Object.values(this.allCode);
  }

  public getCode (id: string): Code | null {
    return this.allCode[id] || null;
  }

  // public getCodeFromHash (codeHash: string): CodeStored {
  //   return this.allCode[shortId(codeHash)];
  // }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async saveCode (code: Pick<Code, never>, anId?: string): Promise<string> {
    const id = anId || newId();
    const existing = anId ? this.getCode(anId) : null;

    const json = {
      ...existing,
      ...code,
      genesisHash: api.genesisHash.toHex(),
      id
    };

    store.set(`${KEY_CODE}${id || newId()}`, json);

    this.addCode(id, json as Code);

    return id;
  }

  public forgetCode (id: string): void {
    store.remove(`${KEY_CODE}${id}`);

    this.removeCode(id);
  }

  public forgetAll (): void {
    Object.keys(this.allCode).forEach((id) => {
      this.forgetCode(id);
    });
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

      store.each((json: Code, key: string): void => {
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

  private addCode (id: string, json: Code): void {
    try {
      this.hashToId[json.codeHash] = id;
      this.allCode[id] = json;

      this.emit('new-code');
    } catch (error) {
      console.error(error);
    }
  }

  private removeCode (id: string): void {
    try {
      const { codeHash } = this.allCode[id];

      delete this.hashToId[codeHash];
      delete this.allCode[id];
      this.emit('removed-code');
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Store();
