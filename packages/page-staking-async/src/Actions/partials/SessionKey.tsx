// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from './types.js';

import React, { useEffect, useState } from 'react';

import { Input, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import SenderInfo from './SenderInfo.js';

interface Props {
  className?: string;
  controllerId: string;
  onChange: (info: SessionInfo) => void;
  stashId: string;
  withFocus?: boolean;
  withSenders?: boolean;
}

const EMPTY_PROOF = new Uint8Array();

function SessionKey ({ className = '', controllerId, onChange, stashId, withFocus, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [keys, setKeys] = useState<string | null>(null);

  useEffect((): void => {
    try {
      onChange({
        sessionTx: isHex(keys)
          ? api?.tx.session.setKeys(keys, EMPTY_PROOF)
          : null
      });
    } catch {
      onChange({ sessionTx: null });
    }
  }, [api?.tx.session, keys, onChange]);

  return (
    <div className={className}>
      {withSenders && (
        <SenderInfo
          controllerId={controllerId}
          stashId={stashId}
        />
      )}
      <Modal.Columns hint={t('The hex output from author_rotateKeys, as executed on the validator node. The keys will show as pending until applied at the start of a new session.')}>
        <Input
          autoFocus={withFocus}
          isError={!keys}
          label={t('Keys from rotateKeys')}
          onChange={setKeys}
          placeholder='0x...'
        />
      </Modal.Columns>
    </div>
  );
}

export default React.memo(SessionKey);
