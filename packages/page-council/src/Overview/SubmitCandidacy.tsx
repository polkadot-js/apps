// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React, { useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

function SubmitCandidacy ({ electionsInfo }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [accountId, setAcountId] = useState<string | null>(null);
  const { isOpen, onClose, onOpen } = useModal();
  const modLocation = api.tx.electionsPhragmen ? 'electionsPhragmen' : 'elections';

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Submit your council candidacy')}
          onClose={onClose}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('Select the account you wish to submit for candidacy.')}
                  label={t<string>('candidate account')}
                  onChange={setAcountId}
                  type='account'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('This account will appear in the list of candidates. With enough votes in an election, it will become either a runner-up or a council member.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  defaultValue={api.consts[modLocation].candidacyBond}
                  help={t<string>('The bond that is reserved')}
                  isDisabled
                  label={t<string>('candidacy bond')}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('The bond will be reserved for the duration of your candidacy and membership.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              isDisabled={!electionsInfo}
              onStart={onClose}
              params={
                api.tx[modLocation].submitCandidacy.meta.args.length === 1
                  ? [electionsInfo?.candidates.length]
                  : []
              }
              tx={`${modLocation}.submitCandidacy`}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        isDisabled={!electionsInfo}
        label={t<string>('Submit candidacy')}
        onClick={onOpen}
      />
    </>
  );
}

export default React.memo(SubmitCandidacy);
