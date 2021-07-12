// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from './types';

import React, { useEffect, useState } from 'react';

import { Input, InputAddress, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../../translate';

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
          // this is weird... :(
          ? api.tx.session.setKeys(keys as any, EMPTY_PROOF)
          : null
      });
    } catch {
      onChange({ sessionTx: null });
    }
  }, [api, keys, onChange]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns hint={t<string>('The stash and controller pair. This transaction, setting the session keys, will be sent from the controller.')}>
          <InputAddress
            defaultValue={stashId}
            isDisabled
            label={t<string>('stash account')}
          />
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t<string>('controller account')}
          />
        </Modal.Columns>
      )}
      <Modal.Columns hint={t<string>('The hex output from author_rotateKeys, as executed on the validator node. The keys will show as pending until applied at the start of a new session.')}>
        <Input
          autoFocus={withFocus}
          help={t<string>('Changing the key only takes effect at the start of the next session. The input here is generated from the author_rotateKeys command')}
          isError={!keys}
          label={t<string>('Keys from rotateKeys')}
          onChange={setKeys}
          placeholder='0x...'
        />
      </Modal.Columns>
    </div>
  );
}

export default React.memo(SessionKey);
