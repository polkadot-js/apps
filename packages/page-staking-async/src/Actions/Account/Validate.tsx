// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ValidateInfo } from '../partials/types.js';

import React, { useState } from 'react';

import { Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';
import ValidatePartial from '../partials/Validate.js';

interface Props {
  controllerId: string;
  minCommission?: BN;
  onClose: () => void;
  stashId: string;
}

function Validate ({ controllerId, minCommission, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ validateTx }, setTx] = useState<ValidateInfo>({});

  return (
    <Modal
      header={t('Set validator preferences')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <ValidatePartial
          controllerId={controllerId}
          minCommission={minCommission}
          onChange={setTx}
          stashId={stashId}
          withFocus
          withSenders
        />
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          extrinsic={validateTx}
          icon='certificate'
          isDisabled={!validateTx}
          label={t('Validate')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Validate);
