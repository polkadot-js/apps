// Copyright 2017-2021 @polkadot/app-custom-signature authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import { EthereumProvider } from './types';
import { useEthProvider } from './useEthProvider';

interface UseMetaMask {
  loadedAccounts: string[];
  activateMetaMask: () => Promise<string[]>;
  requestSignature: (sigPayload: string, account: string) => Promise<string>;
  ethereum?: EthereumProvider;
}

export function useMetaMask (): UseMetaMask {
  const { provider } = useEthProvider();
  const [loadedAccounts, setLoadedAccounts] = useState<string[]>([]);

  const requestAccounts = useCallback(async () => {
    if (!provider) {
      throw new Error('Cannot detect MetaMask');
    }

    const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];

    setLoadedAccounts(accounts);

    return accounts;
  }, [provider]);

  const requestSignature = useCallback(
    async (message: string, account: string = loadedAccounts[0]) => {
      if (!account || !provider) {
        // note: we can call `requestAccounts` here to ensure that an account always is loaded
        throw new Error('No account was provided for the signature');
      }

      const sigResponse = await provider.request({ method: 'personal_sign', params: [account, message] });

      if (!sigResponse || typeof sigResponse !== 'string') {
        throw new Error('Failed to get signature');
      }

      return sigResponse;
    },
    [provider, loadedAccounts]
  );

  useEffect(() => {
    if (provider?.isMetaMask) {
      const ethereum = provider;

      // handle account changes
      // fixme: this event is being called multiple times
      ethereum.on('accountsChanged', (accounts: string[]) => {
        setLoadedAccounts(accounts);

        // console.log(`User changed account to ${accounts[0]}`);
      });

      ethereum.on('chainChanged', () => {
        // refresh the page if the user changes the network
        window.location.reload();
      });
    }
  }, [provider]);

  return { activateMetaMask: requestAccounts, ethereum: provider, loadedAccounts, requestSignature };
}
