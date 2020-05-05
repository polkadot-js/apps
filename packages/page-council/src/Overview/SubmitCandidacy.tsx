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
  const { isOpen, onClose, onOpen } = useModal();

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Submit your council candidacy')}
          onClose={onClose}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t('Select the account you wish to submit for candidacy.')}
                  label={t('candidate account')}
                  onChange={setAcountId}
                  type='account'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('This account will appear in the list of candidates. With enough votes in an election, it will become either a runner-up or a council member.')}</p>
              </Modal.Column>
            </Modal.Columns>
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
        icon='add'
        label={t('Submit candidacy')}
        onClick={onOpen}
      />
    </>
  );
}

export default React.memo(SubmitCandidacy);
