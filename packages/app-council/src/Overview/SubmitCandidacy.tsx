// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Button, Modal, TxAccount, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

export default function SubmitCandidacy (): React.ReactElement {
  const { api } = useApi();
  const { t } = useTranslation();
  const [accountId, onChangeAccountId] = useAccountId();
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button
        isPrimary
        label={t('Submit candidacy')}
        icon='add'
        onClick={onOpen}
      />
      {isOpen && (
        <Modal
          header={t('Submit your council candidacy')}
          onClose={onClose}
          small
        >
          <Modal.Content>
            <TxAccount
              help={t('This account will be nominated to fill the council slot you specify.')}
              label={t('candidate account')}
              onChange={onChangeAccountId}
            />
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              onStart={onClose}
              tx={`${api.tx.electionPhragmen ? 'electionPhragmen' : 'elections'}.submitCandidacy`}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}
