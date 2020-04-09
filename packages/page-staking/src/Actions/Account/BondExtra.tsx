// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Available, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';

interface Props {
  onClose: () => void;
  stashId: string;
}

const ZERO = new BN(0);

function BondExtra ({ onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amountError, setAmountError] = useState<string | null>(null);
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();
  const [maxBalance] = useState<BN | undefined>();

  return (
    <Modal
      className='staking--BondExtra'
      header= {t('Bond more funds')}
      size='small'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
          labelExtra={
            <Available
              label={<span className='label'>{t('transferrable')}</span>}
              params={stashId}
            />
          }
        />
        <InputBalance
          autoFocus
          className='medium'
          help={t('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
          isError={!!amountError || !maxAdditional || maxAdditional.eqn(0)}
          label={t('additional bonded funds')}
          maxValue={maxBalance}
          onChange={setMaxAdditional}
        />
        <ValidateAmount
          accountId={stashId}
          onError={setAmountError}
          value={maxAdditional}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={stashId}
          icon='sign-in'
          isDisabled={!maxAdditional?.gt(ZERO)}
          isPrimary
          label={t('Bond more')}
          onStart={onClose}
          params={[maxAdditional]}
          tx='staking.bondExtra'
          withSpinner={false}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondExtra);
