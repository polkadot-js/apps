// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  controllerId: string;
  onClose: () => void;
  stashId: string;
}

const COMM_MUL = new BN(10000000);
const MAX_COMM = new BN(100);
const ZERO = new BN(0);

function Validate ({ controllerId, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState({ commission: ZERO });

  const _setCommission = useCallback(
    (commission?: BN) => setPrefs({ commission: (commission || ZERO).mul(COMM_MUL) }),
    []
  );

  return (
    <Modal
      className='staking--Staking'
      header={t('Set validator preferences')}
      size='small'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
        />
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <InputNumber
          className='medium'
          help={t('The percentage reward (0-100) that should be applied for the validator')}
          isZeroable
          label={t('reward commission percentage')}
          maxValue={MAX_COMM}
          onChange={_setCommission}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='check circle outline'
          isPrimary
          label={t('Validate')}
          onStart={onClose}
          params={[prefs]}
          tx='staking.validate'
          withSpinner={false}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Validate);
