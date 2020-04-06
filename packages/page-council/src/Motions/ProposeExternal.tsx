// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

function ProposeExternal ({ className, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [proposal, setProposal] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [{ hash, isHashValid }, setHash] = useState<{ hash?: string; isHashValid: boolean }>({ hash: '', isHashValid: false });
  const threshold = Math.ceil((members.length || 0) * 0.5);

  const _onChangeHash = useCallback(
    (hash?: string): void => setHash({ hash, isHashValid: isHex(hash, 256) }),
    []
  );

  useEffect((): void => {
    if (isHashValid && hash) {
      setProposal(() => api.tx.democracy.externalProposeMajority(hash));
    } else {
      setProposal(null);
    }
  }, [api, hash, isHashValid]);

  return (
    <>
      <Button
        icon='add'
        isDisabled={!isMember}
        label={t('Propose external')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t('Propose external (majority)')}
        >
          <Modal.Content>
            <InputAddress
              filter={members}
              help={t('Select the account you wish to make the proposal with.')}
              label={t('propose from account')}
              onChange={setAcountId}
              type='account'
              withLabel
            />
            <Input
              autoFocus
              help={t('The preimage hash of the proposal')}
              label={t('preimage hash')}
              onChange={_onChangeHash}
              value={hash}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!threshold || !members.includes(accountId || '') || !proposal}
              isPrimary
              label={t('Propose')}
              onStart={toggleVisible}
              params={[threshold, proposal]}
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(ProposeExternal);
