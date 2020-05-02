// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  controllerId: string;
  onClose: () => void;
  stashId: string;
}

const EMPTY_PROOF = new Uint8Array();

function SetSessionKey ({ controllerId, onClose, stashId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<string | null>(null);

  return (
    <Modal
      className='staking--SetSessionAccount'
      header={t('Set Session Key')}
      size='large'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
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
          </Modal.Column>
          <Modal.Column>
            <p>{t('The stash and controller pair. This transaction, setting the session keys, will be sent from the controller.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              autoFocus
              help={t('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
              isError={!keys}
              label={t('Keys from rotateKeys')}
              onChange={setKeys}
              placeholder='0x...'
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The hex output from author_rotateKeys, as executed on the validator node. The keys will show as pending until applied at the start of a new session.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='sign-in'
          isDisabled={!keys}
          isPrimary
          label={t('Set Session Key')}
          onStart={onClose}
          params={[keys, EMPTY_PROOF]}
          tx='session.setKeys'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetSessionKey);
