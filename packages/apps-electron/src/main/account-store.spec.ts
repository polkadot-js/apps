// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FileStore } from '@polkadot/ui-keyring/stores';
import { accountStoreIpcHandler } from './account-store';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { IpcMainHandler } from './ipc-main-handler';
import * as tmp from 'tmp';

const exampleAccount = (address: string): KeyringJson => ({
  address,
  meta: {}
});

describe('Account store', () => {
  let accountStore: IpcMainHandler;
  let tmpDir: tmp.DirResult;

  beforeEach(() => {
    tmpDir = tmp.dirSync({ unsafeCleanup: true });
    accountStore = accountStoreIpcHandler(new FileStore(tmpDir.name));
  });

  afterEach(() => {
    tmpDir.removeCallback();
  });

  it('all returns empty array at first', () => {
    expect(accountStore['account-store-all']()).toEqual([]);
  });

  it('after adding accounts, they become visible', async () => {
    await accountStore['account-store-set']('1', exampleAccount('a'));
    await accountStore['account-store-set']('2', exampleAccount('b'));

    expect(accountStore['account-store-all']()).toEqual([{
      key: '1', value: exampleAccount('a')
    }, {
      key: '2', value: exampleAccount('b')
    }]);
  });

  it('get returns account if exists', async () => {
    await accountStore['account-store-set']('1', exampleAccount('a'));
    expect(await accountStore['account-store-get']('1')).toEqual(exampleAccount('a'));
  });

  it('get returns null if account does not exist', async () => {
    expect(await accountStore['account-store-get']('1')).toEqual(null);
  });

  it('account disappears from list after it is removed', async () => {
    await accountStore['account-store-set']('1', exampleAccount('a'));
    await accountStore['account-store-remove']('1');

    expect(await accountStore['account-store-get']('1')).toEqual(null);
    expect(accountStore['account-store-all']()).toEqual([]);
  });
});
