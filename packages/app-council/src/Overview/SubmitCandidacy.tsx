// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxSource } from '@polkadot/react-hooks/types';

import React from 'react';
import { Button, Modal, TxAccount, TxActions } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

export default function SubmitCandidacy (): React.ReactElement {
  const { api } = useApi();
  const { t } = useTranslation();
  const { isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
    (): TxSource => ({
      tx: (api.tx.electionPhragmen || api.tx.elections).submitCandidacy(),
      isSubmittable: true
    })
  );

  return (
    <>
      <Button
        isPrimary
        label={t('Submit candidacy')}
        icon='add'
        onClick={onOpen}
      />
      <Modal
        header={t('Submit your council candidacy')}
        open={isOpen}
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
        <TxActions
          isSubmittable={isSubmittable}
          onCancel={onClose}
          onSend={sendTx}
        />
      </Modal>
    </>
  );
}
