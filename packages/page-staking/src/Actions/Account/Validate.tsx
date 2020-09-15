// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ValidateInfo } from '../partials/types';

import React, { useState } from 'react';
import { Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import ValidatePartial from '../partials/Validate';

interface Props {
  controllerId: string;
  onClose: () => void;
  stashId: string;
}

function Validate ({ controllerId, onClose, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ validateTx }, setTx] = useState<ValidateInfo>({});

  return (
    <Modal
      header={t<string>('Set validator preferences')}
      size='large'
    >
      <Modal.Content>
        <ValidatePartial
          controllerId={controllerId}
          onChange={setTx}
          stashId={stashId}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          extrinsic={validateTx}
          icon='certificate'
          isDisabled={!validateTx}
          label={t<string>('Validate')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Validate);
