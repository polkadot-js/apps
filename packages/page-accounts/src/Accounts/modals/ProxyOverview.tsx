// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AccountId, ProxyType } from '@polkadot/types/interfaces';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useState, useMemo } from 'react';
import { Button, InputAddress, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';
import styled from 'styled-components';

interface Props {
  proxiedAccount: string;
  className?: string;
  onClose: () => void;
  previousAmount?: BN;
  previousDelegatingAccount?: string;
  previousProxy?: [[AccountId, ProxyType][], BN];
}

function ProxyOverview ({ className, onClose, previousAmount, previousDelegatingAccount, previousProxy, proxiedAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [maxBalance] = useState<BN | undefined>();
  const [amount, setAmount] = useState<BN | undefined>(previousAmount);
  const [delegatingAccount, setDelegatingAccount] = useState<string | null>(previousDelegatingAccount || null);
  const [delegatedAccount, setDelegatedAccount] = useState<string | null>(proxiedAccount || null);

  const isDirty = amount?.toString() !== previousAmount?.toString() ||
    delegatedAccount !== proxiedAccount ||
    delegatingAccount !== previousDelegatingAccount;

  const typeOpts = [
    { text: 'Any', value: 0 },
    { text: 'NonTransfer', value: 1 },
    { text: 'Governance', value: 2 },
    { text: 'Staking', value: 3 },
    { text: 'IdentityJudgment', value: 4 }
  ];

  console.log('previousProxy', previousProxy?.toString());

  return (
    <Modal
      className={className}
      header={t<string>('Proxy overview')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              isDisabled={true}
              label={t<string>('account')}
              type='account'
              value={proxiedAccount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Any account set as proxy will be able to perform actions in place of the proxied account')}</p>
            <p>{t<string>('If you add several proxy accounts for the same proxy type (e.g 2 accounts set as proxy for Governance), then any of those account set as proxy will be able to perfom governance actions')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            {previousProxy && previousProxy[0].map(([account, type], index) => {
              console.log('type', type.toString());

              return (
                <div
                  className='proxy-container'
                  key={`${proxiedAccount}-${account.toString()}-${type.toString()}`}
                >
                  <div className='input-column'>
                    <InputAddress
                      isDisabled={true}
                      key={`account-${index}`}
                      label={t<string>('proxy account')}
                      type='account'
                      value={account.toString()}
                    />
                    <Dropdown
                      help={'Type of proxy'}
                      isDisabled={true}
                      label={'type'}
                      options={typeOpts}
                      value={type.toNumber()}
                    />
                  </div>
                  <div className='buttons-column'>
                    <Button
                      icon='times'
                      isNegative
                      key='close'
                      onClick={() => { console.log('bla'); }}
                    />
                  </div>
                </div>
              );
            })}
            <ValidateAmount
              amount={amount}
              delegatingAccount={delegatingAccount}
              onError={setAmountError}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The amount to allocate and the conviction that will be applied to all votes made on a referendum.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={proxiedAccount}
          icon='trash-alt'
          isNegative
          label={t<string>('Remove all proxies')}
          onStart={onClose}
          params={[]}
          tx='proxy.removeProxies'
        />
        <TxButton
          accountId={proxiedAccount}
          icon='sign-in-alt'
          isDisabled={!amount?.gt(BN_ZERO) || !!amountError?.error || !isDirty}
          isPrimary
          label={t<string>('Save')}
          onStart={onClose}
          params={[delegatedAccount, amount]}
          tx='democracy.delegate'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(ProxyOverview)`
  .proxy-container{
    display: grid;
    grid-column-gap: 0.5rem;
    margin-bottom: 1rem;
    
    .input-column{
      grid-column: 1;
    }
    .buttons-column{
      grid-column: 2;
      padding-top: 0.3rem;
    }
  }
`);
