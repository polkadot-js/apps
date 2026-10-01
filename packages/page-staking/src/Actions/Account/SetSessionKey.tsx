// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from '../partials/types.js';

import React, { useState } from 'react';

import { Modal, TxButton } from '@polkadot/react-components';
import { useApi, useStakingAsyncApis } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import SessionKeyPartital from '../partials/SessionKey.js';
import { requiresOwnershipProof } from '../partials/sessionKeyProof.js';

interface Props {
  controllerId: string;
  onClose: () => void;
  stashId: string;
}

function SetSessionKey ({ controllerId, onClose, stashId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isStakingAsync, rcApi } = useStakingAsyncApis();
  const sessionApi = isStakingAsync ? rcApi : api;
  const needsProof = !!sessionApi && requiresOwnershipProof(sessionApi);
  const [{ sessionTx }, setTx] = useState<SessionInfo>({});

  return (
    <Modal
      header={t('Set Session Key')}
      onClose={onClose}
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
      <Modal.Actions>
        <TxButton
          accountId={needsProof ? stashId : controllerId}
          extrinsic={sessionTx}
          icon='sign-in-alt'
          isDisabled={!sessionTx}
          label={t('Set Session Key')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetSessionKey);
