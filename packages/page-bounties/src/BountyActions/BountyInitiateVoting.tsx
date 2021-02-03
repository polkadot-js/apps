// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
}

const BOUNTY_METHODS = ['approveBounty', 'closeBounty'];

function BountyInitiateVoting ({ index, proposals }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers();
  const { approveBounty, closeBounty } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const approveBountyProposal = useRef(approveBounty(index));
  const closeBountyProposal = useRef(closeBounty(index));

  const isVotingInitiated = useMemo(() => proposals?.filter(({ proposal }) => BOUNTY_METHODS.includes(proposal.method)).length !== 0, [proposals]);

  return isMember && !isVotingInitiated
    ? (
      <>
        <Button
          icon='step-forward'
          isDisabled={false}
          label={t<string>('Initiate Voting')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>('Initiate Voting')}
            size='large'
          >
            <Modal.Content>
              <Modal.Columns>
                <Modal.Column>
                  <p>{t<string>('This action will create a Council motion to either approve or reject the Bounty.')}</p>
                </Modal.Column>
                <Modal.Column>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={members}
                    help={t<string>('Select the council account you wish to use to create a motion for the Bounty.')}
                    label={t<string>('vote with account')}
                    onChange={setAccountId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The council member that will create a motion, submission equates to an "aye" vote for chosen option.')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={false}
                label={t<string>('Approve')}
                onStart={toggleOpen}
                params={[threshold, approveBountyProposal.current, approveBountyProposal.current.length]}
                tx={api.tx.council.propose}
              />
              <TxButton
                accountId={accountId}
                icon='ban'
                isDisabled={false}
                label={t<string>('Reject')}
                onStart={toggleOpen}
                params={[threshold, closeBountyProposal.current, closeBountyProposal.current.length]}
                tx={api.tx.council.propose}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(BountyInitiateVoting);
