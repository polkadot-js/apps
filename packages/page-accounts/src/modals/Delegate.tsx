// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AmountValidateState } from '../Accounts/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { ConvictionDropdown, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { BalanceFree } from '@polkadot/react-query';
import { Conviction } from '@polkadot/types/interfaces';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import ValidateAmount from './InputValidateAmount';

interface Props {
  onClose: () => void;
  previousAmount?: BN;
  previousConviction?: Conviction;
  previousDelegatedAccount?: string;
  previousDelegatingAccount?: string;
}

function Delegate ({ onClose, previousAmount, previousConviction, previousDelegatedAccount, previousDelegatingAccount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [maxBalance] = useState<BN | undefined>();
  const [amount, setAmount] = useState<BN | undefined>(previousAmount);
  const [delegatingAccount, setDelegatingAccount] = useState<string | null>(previousDelegatingAccount || null);
  const [delegatedAccount, setDelegatedAccount] = useState<string | null>(previousDelegatedAccount || null);
  const defaultConviction = previousConviction === undefined
    ? 0
    : previousConviction.toNumber();
  const [conviction, setConviction] = useState(defaultConviction);

  const isDirty = amount?.toString() !== previousAmount?.toString() ||
    delegatedAccount !== previousDelegatedAccount ||
    delegatingAccount !== previousDelegatingAccount ||
    conviction !== previousConviction?.toNumber();

  return (
    <Modal
      className='staking--Delegate'
      header={previousDelegatedAccount
        ? t<string>('democracy vote delegation')
        : t<string>('delegate democracy vote')
      }
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('delegating account')}
              onChange={setDelegatingAccount}
              type='account'
              value={delegatingAccount}
            />
            <InputAddress
              label={t<string>('delegated account')}
              onChange={setDelegatedAccount}
              type='account'
              value={delegatedAccount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Any democracy vote performed by the delegated account will result in an additional vote from the delegating account')}</p>
            <p>{t<string>('If the delegated account is currently voting in a referendum, the delegating vote and conviction will be added.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              autoFocus
              help={t<string>('Amount to delegate for any democracy vote. This is adjusted using the available funds on the account.')}
              isError={!!amountError?.error}
              isZeroable={false}
              label={t<string>('delegating amount')}
              labelExtra={
                <BalanceFree
                  label={<span className='label'>{t<string>('balance')}</span>}
                  params={delegatingAccount}
                />
              }
              maxValue={maxBalance}
              onChange={setAmount}
              value={amount}
            />
            <ValidateAmount
              amount={amount}
              delegatingAccount={delegatingAccount}
              onError={setAmountError}
            />
            <ConvictionDropdown
              help={t<string>('The conviction that will be used for each delegated vote.')}
              label={t<string>('conviction')}
              onChange={setConviction}
              value={conviction}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The amount to allocate and the conviction that will be applied to all votes made on a referendum.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        {previousDelegatedAccount && (
          <TxButton
            accountId={delegatingAccount}
            icon='trash-alt'
            label={t<string>('Undelegate')}
            onStart={onClose}
            params={[]}
            tx='democracy.undelegate'
          />
        )}
        <TxButton
          accountId={delegatingAccount}
          icon='sign-in-alt'
          isDisabled={!amount?.gt(BN_ZERO) || !!amountError?.error || !isDirty}
          label={previousDelegatedAccount
            ? t<string>('Save delegation')
            : t<string>('Delegate')
          }
          onStart={onClose}
          params={[delegatedAccount, conviction, amount]}
          tx='democracy.delegate'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Delegate);
