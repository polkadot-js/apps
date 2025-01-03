// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Warned on by nodenext resolution (while package does build in bundler mode)
import type { KeyringJson } from '@polkadot/ui-keyring/types';

import { RemoteElectronStore } from './remote-electron-store.js';

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

      expect(cb).toHaveBeenNthCalledWith(1, 1, 'a');
      expect(cb).toHaveBeenNthCalledWith(2, 2, 'b');
    });
  });

  describe('get', () => {
    it('calls callback with returned account', async () => {
      accountStore.get.mockResolvedValue('a');
      const cb = jest.fn();

      remoteStore.get('1', cb);
      await Promise.resolve();

      expect(accountStore.get).toHaveBeenCalledWith('1');
      expect(cb).toHaveBeenCalledWith('a');
    });

    it('calls callback with null if no accounts found', async () => {
      accountStore.get.mockResolvedValue(null);
      const cb = jest.fn();

      remoteStore.get('1', cb);
      await Promise.resolve();

      expect(cb).toHaveBeenCalledWith(null);
    });
  });

  describe('remove', () => {
    it('calls callback after success', async () => {
      accountStore.remove.mockResolvedValue(null);
      const cb = jest.fn();

      remoteStore.remove('1', cb);
      await Promise.resolve();

      expect(accountStore.remove).toHaveBeenCalledWith('1');
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  describe('set', () => {
    it('calls callback after success', async () => {
      accountStore.set.mockResolvedValue(null);
      const cb = jest.fn();

      remoteStore.set('1', 'a' as unknown as KeyringJson, cb);
      await Promise.resolve();

      expect(accountStore.set).toHaveBeenCalledWith('1', 'a');
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });
});
