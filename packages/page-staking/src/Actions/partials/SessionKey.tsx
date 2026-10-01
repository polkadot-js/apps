// Copyright 2017-2026 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnershipProof } from './sessionKeyProof.js';
import type { SessionInfo } from './types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { Input, MarkWarning, Modal } from '@polkadot/react-components';
import { useApi, useStakingAsyncApis } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import SenderInfo from './SenderInfo.js';
import { isNonEmptyHex, requiresOwnershipProof, validOwnershipProof } from './sessionKeyProof.js';

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
  const { isStakingAsync, rcApi } = useStakingAsyncApis();
  const [keys, setKeys] = useState<string | null>(null);
  const [ownershipProof, setOwnershipProof] = useState<OwnershipProof | null>(null);
  const sessionApi = isStakingAsync ? rcApi : api;
  const needsProof = !!sessionApi && requiresOwnershipProof(sessionApi);
  const proofIsValid = validOwnershipProof(ownershipProof, stashId, keys);

  useEffect((): void => {
    setOwnershipProof(null);
  }, [sessionApi, stashId]);

  const _setKeys = useCallback((value: string): void => {
    setKeys(value);
    setOwnershipProof(null);
  }, []);

  const _setProof = useCallback((proof: string): void => {
    setOwnershipProof({ keys: keys || '', proof, stashId });
  }, [keys, stashId]);

  useEffect((): void => {
    try {
      onChange({
        sessionTx: isNonEmptyHex(keys) && (!needsProof || proofIsValid)
          ? sessionApi?.tx.session.setKeys(keys, needsProof ? (ownershipProof?.proof || EMPTY_PROOF) : EMPTY_PROOF)
          : null
      });
    } catch {
      onChange({ sessionTx: null });
    }
  }, [keys, needsProof, onChange, ownershipProof, proofIsValid, sessionApi, stashId]);

  return (
    <div className={className}>
      {isStakingAsync && (
        <Modal.Columns>
          <MarkWarning content={t('This operation will be performed on the relay chain.')} />
        </Modal.Columns>
      )}
      {withSenders && (
        <SenderInfo
          controllerId={needsProof ? stashId : controllerId}
          stashId={stashId}
        />
      )}
      <Modal.Columns hint={needsProof
        ? t('Generate keys and proof with author_rotateKeysWithOwner on the validator node, using the SCALE-encoded stash account as owner. Paste the keys field here. The keys become active at a later session.')
        : t('The hex output from author_rotateKeys, as executed on the validator node. The keys will show as pending until applied at the start of a new session.')}
      >
        <Input
          autoFocus={withFocus}
          isError={!isNonEmptyHex(keys)}
          label={needsProof ? t('Keys from rotateKeysWithOwner') : t('Keys from rotateKeys')}
          onChange={_setKeys}
          placeholder='0x...'
        />
      </Modal.Columns>
      {needsProof && (
        <Modal.Columns hint={t('Paste the proof field returned with these keys for this stash. Changing the stash or keys clears the proof. The transaction must be signed by the stash account.')}>
          <Input
            isError={!proofIsValid}
            label={t('Session key ownership proof')}
            onChange={_setProof}
            placeholder='0x...'
            value={ownershipProof?.proof || ''}
          />
        </Modal.Columns>
      )}
    </div>
  );
}

export default React.memo(SessionKey);
