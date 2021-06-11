// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isDisabled: boolean;
}

function Bid ({ className, isDisabled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const [duration, setDuration] = useState<BN | undefined>();

  const isAmountError = !amount || amount.isZero() || amount.lt(api.consts.gilt.minFreeze);
  const isDurationError = !duration || !duration.gte(BN_ONE) || duration.gt(api.consts.gilt.queueCount);

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts || isDisabled}
        label={t<string>('Submit Bid')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('submit gilt bid')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('This account will make the bid for the gilt and pay all associated fees.')}>
              <InputAddress
                help={t<string>('The account you want to register the preimage from')}
                label={t<string>('send from account')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t<string>('transferrable')}</span>}
                    params={accountId}
                  />
                }
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount you wish to lock for the duration. It needs to be more than the gilt minimum.')}>
              <InputBalance
                autoFocus
                defaultValue={api.consts.gilt.minFreeze}
                isError={isAmountError}
                isZeroable={false}
                label={t<string>('bid amount')}
                onChange={setAmount}
              />
              <InputBalance
                defaultValue={api.consts.gilt.minFreeze}
                help={t<string>('The minimum amount that is allowed as a bid')}
                isDisabled
                label={t<string>('minimum freeze amount')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The number of periods this bid is to be freezed for, less than the maximum period')}>
              <InputNumber
                defaultValue={BN_ONE}
                isError={isDurationError}
                isZeroable={false}
                label={t<string>('lock periods')}
                onChange={setDuration}
              />
              <InputNumber
                defaultValue={api.consts.gilt.queueCount}
                isDisabled
                label={t<string>('maximum lock periods')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={isAmountError || isDurationError}
              label={t<string>('Bid')}
              onStart={toggleOpen}
              params={[amount, duration]}
              tx={api.tx.gilt.placeBid}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);
