// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';
import { getThreshold } from '../thresholds';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

interface HashState {
  hash?: string;
  isHashValid: boolean;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function ProposeExternal ({ className = '', isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [{ hash, isHashValid }, setHash] = useState<HashState>({ hash: '', isHashValid: false });

  const threshold = Math.ceil((members.length || 0) * getThreshold(api));

  const _onChangeHash = useCallback(
    (hash?: string): void => setHash({ hash, isHashValid: isHex(hash, 256) }),
    []
  );

  useEffect((): void => {
    if (isHashValid && hash) {
      const proposal = api.tx.democracy.externalProposeMajority(hash);

      setProposal({
        proposal,
        proposalLength: proposal.encodedLength || 0
      });
    } else {
      setProposal({
        proposal: null,
        proposalLength: 0
      });
    }
  }, [api, hash, isHashValid]);

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t<string>('Propose external')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t<string>('Propose external (majority)')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the account you wish to make the proposal with.')}
                  label={t<string>('propose from account')}
                  onChange={setAcountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The council account for the proposal. The selection is filtered by the current members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Input
                  autoFocus
                  help={t<string>('The preimage hash of the proposal')}
                  label={t<string>('preimage hash')}
                  onChange={_onChangeHash}
                  value={hash}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The hash of the proposal image, either already submitted or valid for the specific call.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!threshold || !members.includes(accountId || '') || !proposal}
              label={t<string>('Propose')}
              onStart={toggleVisible}
              params={
                api.tx.council.propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(ProposeExternal);
