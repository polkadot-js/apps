// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SessionInfo } from './types';

import React, { useEffect, useState } from 'react';
import { InputAddress, Input, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  onChange: (info: SessionInfo) => void;
  stashId: string;
  withSenders?: boolean;
}

const EMPTY_PROOF = new Uint8Array();

function SessionKey ({ className = '', controllerId, onChange, stashId, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [keys, setKeys] = useState<string | null>(null);

  useEffect((): void => {
    onChange({
      sessionTx: isHex(keys)
        // this is weird... :(
        ? api.tx.session.setKeys(keys as any, EMPTY_PROOF)
        : null
    });
  }, [api, keys, onChange]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns>
          <Modal.Column>
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
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The stash and controller pair. This transaction, setting the session keys, will be sent from the controller.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      <Modal.Columns>
        <Modal.Column>
          <Input
            autoFocus
            help={t<string>('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
            isError={!keys}
            label={t<string>('Keys from rotateKeys')}
            onChange={setKeys}
            placeholder='0x...'
          />
        </Modal.Column>
        <Modal.Column>
          <p>{t<string>('The hex output from author_rotateKeys, as executed on the validator node. The keys will show as pending until applied at the start of a new session.')}</p>
        </Modal.Column>
      </Modal.Columns>
    </div>
  );
}

export default React.memo(SessionKey);
