// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useState, useMemo } from 'react';
import { InputAddress, InputBalance, Modal, TxButton, Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';

interface Props {
  onClose: () => void;
}

const CONVICTIONS: [number, number][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock]);

function Delegate ({ onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [maxBalance] = useState<BN | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const [delegatingAccount, setDelegatingAccount] = useState<string | null>(null);
  const [delegatedAccount, setDelegatedAccount] = useState<string | null>(null);
  const [conviction, setConviction] = useState(1);

  const { api } = useApi();
  const [enact] = useState(
    (api.consts.democracy.enactmentPeriod.toNumber() * api.consts.timestamp.minimumPeriod.toNumber() / 1000 * 2) / 60 / 60 / 24
  );

  const convictionOpts = useMemo(() => [
    { text: t<string>('0.1x voting balance, no lockup period'), value: 0 },
    ...CONVICTIONS.map(([value, lock]): { text: string; value: number } => ({
      text: t<string>('{{value}}x voting balance, locked for {{lock}}x enactment ({{period}} days)', {
        replace: {
          lock,
          period: (enact * lock).toFixed(2),
          value
        }
      }),
      value
    }))
  ], [t, enact]);

  return (
    <Modal
      className='staking--Delegate'
      header= {t<string>('Delegate democracy vote')}
      size='large'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('delegating account')}
              onChange={setDelegatingAccount}
              value={delegatingAccount}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Any democracy vote performed by the delegated account will result in an additional vote from the delegating account with the selected amount of funds and conviction')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('delegated account')}
              onChange={setDelegatedAccount}
              value={delegatedAccount}
            />
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputBalance
              help={t<string>('Amount to delegate for any democracy vote. This is adjusted using the available funds on the account.')}
              isError={!!amountError?.error}
              label={t<string>('delegating amount')}
              labelExtra={
                <BalanceFree
                  label={<span className='label'>{t<string>('balance')}</span>}
                  params={delegatingAccount}
                />
              }
              maxValue={maxBalance}
              onChange={setAmount}
            />
            <ValidateAmount
              amount={amount}
              delegatingAccount={delegatingAccount}
              onError={setAmountError}
            />
            <Dropdown
              help={t<string>('The conviction that will be used for each delegated vote.')}
              label={t<string>('conviction')}
              onChange={setConviction}
              options={convictionOpts}
              value={conviction}
            />
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={delegatingAccount}
          icon='sign-in-alt'
          isDisabled={!amount?.gt(BN_ZERO) || !!amountError?.error}
          isPrimary
          label={t<string>('Delegate')}
          onStart={onClose}
          params={[delegatedAccount, conviction, amount]}
          tx='democracy.delegate'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Delegate);
