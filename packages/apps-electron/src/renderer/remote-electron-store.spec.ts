// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringJson } from '@polkadot/ui-keyring/types';

import { RemoteElectronStore } from './remote-electron-store';

describe('Remote Electron Store', () => {
  const accountStore = {
    all: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
    set: jest.fn()
  };
  const remoteStore = new RemoteElectronStore(accountStore);

  beforeEach(() => {
    accountStore.all.mockClear();
    accountStore.get.mockClear();
    accountStore.remove.mockClear();
    accountStore.set.mockClear();
  });

  describe('all', () => {
    it('calls callback for each returned account', async () => {
      accountStore.all.mockResolvedValue([{
        key: 1,
        value: 'a'
      }, {
        key: 2,
        value: 'b'
      }]);
      const cb = jest.fn();

      remoteStore.all(cb);
      await Promise.resolve();

      expect(cb).nthCalledWith(1, 1, 'a');
      expect(cb).nthCalledWith(2, 2, 'b');
    });
  });

  describe('get', () => {
    it('calls callback with returned account', async () => {
      accountStore.get.mockResolvedValue('a');
      const cb = jest.fn();

      remoteStore.get('1', cb);
      await Promise.resolve();

      expect(accountStore.get).toBeCalledWith('1');
      expect(cb).toBeCalledWith('a');
    });

    it('calls callback with null if no accounts found', async () => {
      accountStore.get.mockResolvedValue(null);
      const cb = jest.fn();

      remoteStore.get('1', cb);
      await Promise.resolve();

      expect(cb).toBeCalledWith(null);
    });
  });

  describe('remove', () => {
    it('calls callback after success', async () => {
      accountStore.remove.mockResolvedValue(null);
      const cb = jest.fn();

      remoteStore.remove('1', cb);
      await Promise.resolve();

      expect(accountStore.remove).toBeCalledWith('1');
      expect(cb).toBeCalledTimes(1);
    });
  });

  describe('set', () => {
    it('calls callback after success', async () => {
      accountStore.set.mockResolvedValue(null);
      const cb = jest.fn();

      remoteStore.set('1', 'a' as unknown as KeyringJson, cb);
      await Promise.resolve();

      expect(accountStore.set).toBeCalledWith('1', 'a');
      expect(cb).toBeCalledTimes(1);
    });
  });
});
