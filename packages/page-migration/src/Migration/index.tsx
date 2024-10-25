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
import MarkSuccess from '@polkadot/react-components/MarkSuccess';

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
  const [success, setSuccess] = useState<boolean>(false);
  const [selectFromDropdown, setSelectFromDropdown] = useState<boolean>(false);
  const [cheqdAddresses, setCheqdAddresses] = useState<string[]>([]);
  const { api } = useApi();
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [senderId]);

  const values = [cheqdId];
  const extrinsic = api && api.tx && api.tx.cheqdMigration && api.tx.cheqdMigration.migrate(values);
  const isValid = senderId && cheqdId && isValidCheqdAddress(cheqdId);

  function handleSuccess() {
    setSuccess(true);
  }

  function handleRestart() {
    setSuccess(false);
    setCheqdId('');
    setSenderId(null);
  }

  async function getExtensionAddresses() {
    const chainId = 'cheqd-mainnet-1';
    const walletObj = window.keplr || window.leap;

    await walletObj.enable(chainId);

    const offlineSigner = walletObj.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    setCheqdAddresses([...cheqdAddresses, ...accounts.map(({ address }) => address)]);
    setSelectFromDropdown(accounts.length > 0);
  }

  useEffect(() => {
    if (window.keplr) {
      getExtensionAddresses();
    }
  }, []);

  return success ? (
    <div className={`staking--Overview ${className}`}>
      <MarkSuccess
        className='success centered'
        content={t<string>('Your token migration transaction has been submitted successfully.')}
      />
      
      <p style={{
        fontSize: '32px',
        fontWeight: 500,
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        TRANSACTION COMPLETE
      </p>
      
      <p style={{
        fontSize: '18px',
        marginBottom: '20px',
        textAlign: 'center',
        maxWidth: '70%',
        margin: '0 auto',
      }}>
        Your token migration transaction has been submitted successfully. Migrating your Dock balance to cheqd will zero the balance on your Dock account. The migration will take up to 1-2 business days to complete, after that the converted $CHEQ amount will be available in the indicated cheqd wallet. 
        <br /><br />
        <Button
          icon='sync'
          label={t<string>('Migrate another account')}
          onClick={handleRestart}
        />
      </p>
    </div>
  ) : (
    <div className={`staking--Overview ${className}`}>
      <MarkWarning
        className='warning centered'
        content={t<string>('Migrating your Dock balance to cheqd will zero the balance on your Dock account.')}
      />
      
      <p style={{
        fontSize: '18px',
        marginBottom: '20px',
      }}>
        The Dock network is migrating its functionality and all tokens to the cheqd blockchain. This migration will allow Dock to leverage cheqd’s advanced infrastructure and bring enhanced value to both ecosystems. Existing $DOCK tokens will be converted into $CHEQ tokens, ensuring a smooth transition for all token holders. 
      </p>
      
      <p style={{
        fontSize: '18px',
        marginBottom: '20px',
      }}>
        Before you start the process make sure you have a cheqd account. If you do not currently have one, <a href="https://docs.cheqd.io/product/network/wallets" target="_blank">see instructions on how to create one</a>.
      </p>
      
      <p style={{
        fontSize: '18px',
      }}>
        To migrate your $DOCK tokens:
      </p>
      <ol
        style={{
        fontSize: '18px',
        marginBottom: '20px',
        lineHeight: '34px',
      }}>
        <li>
          Select your Dock account. If it isn't there follow <a href="https://docs.dock.io/dock-token/dock-token-migration/adding-account-to-the-dock-browser-wallet" target="_blank">these instructions</a>.
        </li>
        <li>
        Enter your cheqd account manually or connect a web browser extension wallet. Connecting an extension will allow us to confirm that the tokens are going to the cheqd account that you control.
        </li>
        <li>
          Accept T&Cs and click <strong>Submit</strong>
        </li>
        <li>
          Authorize the transaction by entering your account password. Click Sign & Submit
        </li>
      </ol>
      
      <p style={{
        fontSize: '18px',
        marginBottom: '20px',
      }}>
        The entire amount of the account will be migrated at once. After the migration request is submitted your $DOCK tokens will be burnt and you will be sent the converted CHEQD amount with <strong>Swap Ratio</strong>: 18.5178 $DOCK to 1 $CHEQ. The migration will take up to 1-2 business days to complete, after that the converted $CHEQ amount will be available in the indicated cheqd wallet.
      </p>
      
      <p style={{
        fontSize: '18px',
        marginBottom: '20px',
      }}>
        The migration service will only be available until <strong>February 28, 2025</strong>.
        <br />
        Please follow these instructions carefully and contact our team with any questions at support@dock.io.
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
            help={t<string>('The cheqd account your tokens will be migrated to.')}
            label={t<string>('extension account')}
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
            help={t<string>('The cheqd account your tokens will be migrated to.')}
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
        By submitting this transaction you agree to the <a href="https://docs.dock.io/dock-token/dock-token-migration/migration-terms-and-conditions">migration terms and conditions</a>.
      </p>

      <br />

      <Button.Group>
        <TxButton
          accountId={senderId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!isValid}
          onSuccess={handleSuccess}
          label={t<string>('Submit Transaction')}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(MigrationApp);
