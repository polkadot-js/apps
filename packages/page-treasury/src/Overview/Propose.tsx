// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Propose ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const [isProposeOpen, togglePropose] = useToggle();
  const [value, setValue] = useState<BN | undefined>();
  const hasValue = value?.gtn(0);

  return (
    <>
      {isProposeOpen && (
        <Modal
          className={className}
          header={t('Submit treasury proposal')}
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
              help={t('The account to which the proposed balance will be transferred if approved')}
              label={t('beneficiary')}
              onChange={setBeneficiary}
              type='allPlus'
            />
            <InputBalance
              className='medium'
              help={t('The amount that will be allocated from the treasury pot')}
              isError={!hasValue}
              label={t('value')}
              onChange={setValue}
            />
          </Modal.Content>
          <Modal.Actions onCancel={togglePropose}>
            <TxButton
              accountId={accountId}
              icon='add'
              isDisabled={!accountId || !hasValue}
              isPrimary
              label={t('Submit proposal')}
              onStart={togglePropose}
              params={[value, beneficiary]}
              tx='treasury.proposeSpend'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        label={t('Submit proposal')}
        onClick={togglePropose}
      />
    </>
  );
}

export default React.memo(Propose);
