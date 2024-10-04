// Copyright 2017-2022 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import { Available, Dropdown, InputAddressCheqd } from '@polkadot/react-components';
import { InputAddress, MarkError, MarkWarning, TxButton, Button } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { isValidCheqdAddress, getCheqdAddressError } from '@polkadot/react-components/InputAddressCheqd';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

function convertDockToCheqd(dockBalance) {
  const swapRatio = 18.5178;
  const dockAmt = dockBalance.toNumber() / 1000000;
  const cheqdBalance = dockAmt / swapRatio;
  return cheqdBalance;
}

function MigrationApp ({ className }): React.ReactElement {
  const { t } = useTranslation();
  const [senderId, setSenderId] = useState<string | null>(null);
  const [cheqdId, setCheqdId] = useState<string>('');
  const [selectFromDropdown, setSelectFromDropdown] = useState<boolean>(false);
  const [cheqdAddresses, setCheqdAddresses] = useState<string[]>([]);
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [senderId]);

  const values = [cheqdId];
  const extrinsic = api && api.tx && api.tx.cheqdMigration && api.tx.cheqdMigration.migrate(values);
  const isValid = senderId && cheqdId && isValidCheqdAddress(cheqdId);

  async function getKepirAddresses() {
    const chainId = 'cheqd-mainnet-1';

    await window.keplr.enable(chainId);

    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    setCheqdAddresses([...cheqdAddresses, ...accounts.map(({ address }) => address)]);
    setSelectFromDropdown(accounts.length > 0);
  }

  useEffect(() => {
    if (window.keplr) {
      getKepirAddresses();
    }
  }, []);

  return (
    <div className={`staking--Overview ${className}`}>
      <MarkWarning
        className='warning centered'
        content={t<string>('Migrating your Dock balance to Cheqd will zero the balance on your Dock account.')}
      />
      
      <p style={{
        fontSize: '18px',
        marginBottom: '20px',
      }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>

      <InputAddress
        help={t<string>('The account you will migrate to Cheqd.')}
        label={t<string>('migrate account')}
        labelExtra={
          <Available
            label={t<string>('transferrable')}
            params={senderId}
          />
        }
        value={senderId}
        onChange={setSenderId}
        type='account'
      />

      <br />

      {selectFromDropdown ? (
        <>
          <Dropdown
            className={`ui--InputAddress ${className}`}
            help={t<string>('The Cheqd account your tokens will be migrated to.')}
            label={t<string>('keplr account')}
            isMultiple={false}
            onChange={setCheqdId}
            options={cheqdAddresses.map((cheqdAddress) => ({
              value: cheqdAddress,
              text: cheqdAddress,
            }))}
            value={cheqdId}
          />
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setSelectFromDropdown(false);
          }}>Enter address manually</a>
        </>
      ) : (
        <>
          <InputAddressCheqd
            help={t<string>('The Cheqd account your tokens will be migrated to.')}
            label={t<string>('cheqd account')}
            value={cheqdId}
            onChange={setCheqdId}
            type='account'
          />
          {cheqdAddresses.length > 0 && (
            <>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setSelectFromDropdown(true);
              }}>Select from keplr</a>
            </>
          )}
        </>
      )}

      {cheqdId && !isValidCheqdAddress(cheqdId) && (
        <MarkError
          className='error centered'
          content={t<string>(getCheqdAddressError(cheqdId) || 'This cheqd address is invalid, please check it before continuing.')}
        />
      )}

      <br /><br />
      
      {(senderId && cheqdId && allBalances) ? (
        <p style={{
          fontSize: '18px',
        }}>
          After the migration is complete, your <strong>{formatBalance(allBalances?.freeBalance)}</strong> will be converted into <strong>{convertDockToCheqd(allBalances?.freeBalance)} CHEQD</strong>.
        </p>
      ) : (
        <p style={{
          fontSize: '18px',
        }}>
          
          Enter a sender and receiver address to see the total CHEQD you will receive.
        </p>
      )}
      
      <p style={{
        fontSize: '18px',
      }}>
        By submitting this transaction you agree to the <a href="https://docs.dock.io/dock-token/dock-token-migration">migration terms and conditions</a>.
      </p>

      <br />

      <Button.Group>
        <TxButton
          accountId={senderId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!isValid}
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(MigrationApp);
