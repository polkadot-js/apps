// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, Balance, BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { truncateTitle } from '@polkadot/app-bounties/helpers';
import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useMembers, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
}

const BOUNTY_METHODS = ['unassignCurator'];

function ProposeCuratorAction ({ curatorId, description, index, proposals }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers();
  const { unassignCurator } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const unassignCuratorProposal = useMemo(() => unassignCurator(index), [index]);

  const isVotingInitiated = useMemo(() => proposals?.filter(({ proposal }) => BOUNTY_METHODS.includes(proposal.method)).length !== 0, [proposals]);

  return isMember && !isVotingInitiated
    ? (
      <>
        <Button
          icon='user-slash'
          isDisabled={false}
          label={t<string>('Slash Curator')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>(`Slash Curator from "${truncateTitle(description, 30)}"`)}
            size='large'
          >
            <Modal.Content>
              <Modal.Column>
                <p>{t<string>('This action will create a Council motion to unassign the Curator.')}</p>
              </Modal.Column>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={members}
                    help={t<string>('Select the council account you wish to use to create a motion for a Curator Slash.')}
                    label={t<string>('proposing account')}
                    onChange={setAccountId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The council member that will create the motion.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    help={t<string>('The account that will be unassigned from the curator role.')}
                    isDisabled
                    label={t<string>('current curator')}
                    type='account'
                    value={curatorId}
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('After Curator slashing the bounty will return to the funded status. Then it will be possible to assign a new curator.')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='check'
                label={t<string>('Slash curator')}
                onStart={toggleOpen}
                params={[threshold, unassignCuratorProposal, unassignCuratorProposal?.length]}
                tx={api.tx.council.propose}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(ProposeCuratorAction);
