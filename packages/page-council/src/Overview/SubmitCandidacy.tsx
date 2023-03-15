// Copyright 2017-2023 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u128 } from '@polkadot/types';
import type { ComponentProps as Props } from './types.js';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { useModuleElections } from '../useModuleElections.js';

function SubmitCandidacy ({ electionsInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);
  const { isOpen, onClose, onOpen } = useModal();
  const modLocation = useModuleElections();

  if (!modLocation) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal
          header={t<string>('Submit your council candidacy')}
          onClose={onClose}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('This account will appear in the list of candidates. With enough votes in an election, it will become either a runner-up or a council member.')}>
              <InputAddress
                label={t<string>('candidate account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            {api.consts[modLocation] && (
              <Modal.Columns hint={t<string>('The bond will be reserved for the duration of your candidacy and membership.')}>
                <InputBalance
                  defaultValue={api.consts[modLocation as 'council']?.candidacyBond as u128}
                  isDisabled
                  label={t<string>('candidacy bond')}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              isDisabled={!electionsInfo}
              onStart={onClose}
              params={
                api.tx[modLocation].submitCandidacy.meta.args.length === 1
                  ? [electionsInfo?.candidates.length]
                  : []
              }
              tx={api.tx[modLocation].submitCandidacy}
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
