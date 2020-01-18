// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { TxSource } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxAccount, TxActions } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function isValueValid (value?: BN | null): boolean {
  return !!value && value.gtn(0);
}

export default function Propose (): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [beneficiary, setBeneficiary] = useState<StringOrNull>(null);
  const [value, setValue] = useState<BN | null>(new BN(0));

  const _onChangeValue = (value?: BN | null): void => setValue(value || null);

  const { api } = useApi();
  const { isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
    (): TxSource => ({
      tx: api.tx.treasury.proposeSpend(value, beneficiary || undefined),
      isSubmittable: isValueValid(value) && !!beneficiary
    }),
    [value, beneficiary]
  );

  return (
    <>
      <Button.Group>
        <Button
          isPrimary
          label={t('Submit a spend proposal')}
          icon='add'
          onClick={onOpen}
        />
      </Button.Group>
      <Modal
        open={isOpen}
        onClose={onClose}
        small
      >
        <Modal.Header>
          {t('Submit a spend proposal')}
        </Modal.Header>
        <Modal.Content>
          <TxAccount
            onChange={onChangeAccountId}
          />
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
            onEnter={sendTx}
            onEscape={onClose}
          />
        </Modal.Content>
        <TxActions
          isSubmittable={isSubmittable}
          onCancel={onClose}
          onSend={sendTx}
        />
      </Modal>
    </>
  );
}
