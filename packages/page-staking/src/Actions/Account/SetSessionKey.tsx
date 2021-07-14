// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from '../partials/types';

import React, { useState } from 'react';

import { Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import SessionKeyPartital from '../partials/SessionKey';

interface Props {
  controllerId: string;
  onClose: () => void;
  stashId: string;
}

function SetSessionKey ({ controllerId, onClose, stashId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ sessionTx }, setTx] = useState<SessionInfo>({});

  return (
    <Modal
      header={t<string>('Set Session Key')}
      size='large'
    >
      <Modal.Content>
        <SessionKeyPartital
          controllerId={controllerId}
          onChange={setTx}
          stashId={stashId}
          withFocus
          withSenders
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          extrinsic={sessionTx}
          icon='sign-in-alt'
          isDisabled={!sessionTx}
          label={t<string>('Set Session Key')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetSessionKey);
