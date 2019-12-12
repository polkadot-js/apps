// Copyright 2017-2019 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import translate from '../translate';

function Propose ({ className, t }: Props): React.ReactElement<Props> | null {
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const [value, setValue] = useState<BN | undefined>();
  const [isProposeOpen, togglePropose] = useToggle();

  if (!hasAccounts) {
    return null;
  }

  const hasValue = value?.gtn(0);

  return (
    <>
      {isProposeOpen && (
        <Modal
          className={className}
          header={t('Submit treasury proposal')}
          open
          size='small'
        >
          <Modal.Content>
            <InputAddress
              help={t('Select the account you wish to submit the proposal from.')}
              label={t('submit with account')}
              onChange={setAccountId}
              type='account'
              withLabel
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
              isError={!hasValue}
              help={t('The amount that will be allocated from the treasury pot')}
              label={t('value')}
              onChange={setValue}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button.Group>
              <Button
                icon='cancel'
                isNegative
                label={t('Cancel')}
                onClick={togglePropose}
              />
              <Button.Or />
              <TxButton
                accountId={accountId}
                icon='add'
                isDisabled={!accountId || !hasValue}
                isPrimary
                label={t('Submit proposal')}
                onClick={togglePropose}
                params={[value, beneficiary]}
                tx='treasury.proposeSpend'
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        isPrimary
        label={t('Submit proposal')}
        onClick={togglePropose}
      />
    </>
  );
}

export default translate(Propose);
