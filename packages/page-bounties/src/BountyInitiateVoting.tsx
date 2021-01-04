// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  index: number;
  isMember: boolean;
  members: string[]
  proposals?: DeriveCollectiveProposal[];
}

function BountyInitiateVoting ({ index, isMember, members, proposals }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const approveBountyProposal: SubmittableExtrinsic<'promise'> = (api.tx.bounties || api.tx.treasury).approveBounty(index);
  const closeBountyProposal: SubmittableExtrinsic<'promise'> = (api.tx.bounties || api.tx.treasury).closeBounty(index);

  const isVotingInitiated = useMemo(() => proposals?.filter((deriveProposal) => deriveProposal.proposal.method === 'approveBounty' || deriveProposal.proposal.method === 'closeBounty')
    .length !== 0, [proposals]);

  return isMember && !isVotingInitiated
    ? (
      <>
        <Button
          icon='plus'
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
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('This action will create a Council motion to either approve or reject the Bounty.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={members}
                    help={t<string>('Select the council account you wish to use to create a motion for the Bounty. ')}
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
                params={api.tx.council.propose.meta.args.length === 3
                  ? [threshold, approveBountyProposal, approveBountyProposal.length]
                  : [threshold, approveBountyProposal]
                }
                tx={api.tx.council.propose}
              />
              <TxButton
                accountId={accountId}
                icon='minus-circle'
                isDisabled={false}
                label={t<string>('Reject')}
                onStart={toggleOpen}
                params={api.tx.council.propose.meta.args.length === 3
                  ? [threshold, closeBountyProposal, closeBountyProposal.length]
                  : [threshold, closeBountyProposal]
                }
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
