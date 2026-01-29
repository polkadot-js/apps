// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HashState } from './types.js';

import React, { useState } from 'react';

import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { useTranslation } from '../../translate.js';
import Proposal, { EMPTY_PROPOSAL } from './Partial.js';

interface Props {
  className?: string;
  imageHash?: string;
}

function Add ({ className, imageHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isAddOpen, toggleAdd] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [{ encodedHash, notePreimageTx }, setProposal] = useState<HashState>(EMPTY_PROPOSAL);

  const isMatched = !imageHash || imageHash === encodedHash;

  return (
    <>
      {isAddOpen && (
        <Modal
          className={className}
          header={t('Submit preimage')}
          onClose={toggleAdd}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('This account will pay the fees for the preimage, based on the size thereof.')}>
              <InputAddress
                label={t('send from account')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t('transferable')}</span>}
                    params={accountId}
                  />
                }
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Proposal onChange={setProposal} />
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              extrinsic={notePreimageTx}
              icon='plus'
              isDisabled={!accountId || !isMatched || !notePreimageTx}
              label={t('Submit preimage')}
              onStart={toggleAdd}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        label={t('Add preimage')}
        onClick={toggleAdd}
      />
    </>
  );
}

export default React.memo(Add);
