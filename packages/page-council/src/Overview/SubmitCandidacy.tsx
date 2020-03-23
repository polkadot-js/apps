// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

function SubmitCandidacy (): React.ReactElement {
  const { api } = useApi();
  const { t } = useTranslation();
  const [accountId, setAcountId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Submit your council candidacy')}
          onClose={onClose}
        >
          <Modal.Content>
            <InputAddress
              help={t('Select the account you wish to submit for candidacy.')}
              label={t('candidate account')}
              onChange={setAcountId}
              type='account'
            />
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              onStart={onClose}
              tx={
                api.tx.electionsPhragmen
                  ? 'electionsPhragmen.submitCandidacy'
                  : 'elections.submitCandidacy'
              }
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        label={t('Submit candidacy')}
        icon='add'
        onClick={onOpen}
      />
    </>
  );
}

export default React.memo(SubmitCandidacy);
