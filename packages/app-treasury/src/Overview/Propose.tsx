// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props, StringOrNull } from '@polkadot/react-components/types';
import { TxSource } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import translate from '../translate';

function isValueValid (value?: BN | null): boolean {
  return !!value && value.gtn(0);
}

function Propose ({ t }: Props): React.ReactElement<Props> {
  const [beneficiary, setBeneficiary] = useState<StringOrNull>(null);
  const [value, setValue] = useState<BN | null>(new BN(0));

  const _onChangeValue = (value?: BN | null): void => setValue(value || null);

  const { api } = useApi();
  const txModalState = useTxModal(
    (): TxSource => ({
      tx: api.tx.treasury.proposeSpend(value, beneficiary || undefined),
      isSubmittable: isValueValid(value) && !!beneficiary
    }),
    [value, beneficiary]
  );

  return (
    <TxModal
      {...txModalState}
      header={t('Submit a spend proposal')}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <Button.Group>
            <Button
              isPrimary
              label={t('Submit a spend proposal')}
              icon='add'
              onClick={onOpen}
            />
          </Button.Group>
        ))
      }
    >
      <InputAddress
        className='medium'
        label={t('beneficiary')}
        help={t('The account to which the proposed balance will be transferred if approved')}
        type='allPlus'
        onChange={setBeneficiary}
      />
      <InputBalance
        className='medium'
        isError={!isValueValid(value)}
        help={t('The amount that will be allocated from the treasury pot')}
        label={t('value')}
        onChange={_onChangeValue}
        onEnter={txModalState.sendTx}
        onEscape={txModalState.onClose}
      />
    </TxModal>
  );
}

export default translate(Propose);
