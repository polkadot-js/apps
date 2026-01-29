// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, useCollectiveMembers, useToggle } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { truncateTitle } from '../helpers/index.js';
import { useBounties } from '../hooks/index.js';
import { useTranslation } from '../translate.js';

interface Props {
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
}

const BOUNTY_METHODS = ['approveBounty', 'closeBounty'];

function BountyInitiateVoting ({ description, index, proposals }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useCollectiveMembers('council');
  const councilMod = useCollectiveInstance('council');
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

  const isVotingInitiated = useMemo(
    () => proposals?.filter(({ proposal }) =>
      proposal && BOUNTY_METHODS.includes(proposal.method)
    ).length !== 0,
    [proposals]
  );

  return isMember && !isVotingInitiated && councilMod
    ? (
      <>
        <Button
          icon='step-forward'
          isDisabled={false}
          label={t('Initiate voting')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={`${t('Initiate voting')} - "${truncateTitle(description, 30)}"`}
            onClose={toggleOpen}
            size='large'
          >
            <Modal.Content>
              <Modal.Columns hint={t('The council member that will create a motion, submission equates to an "aye" vote for chosen option.')}>
                <InputAddress
                  filter={members}
                  label={t('vote with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions>
              <TxButton
                accountId={accountId}
                icon='check'
                isDisabled={false}
                label={t('Approve')}
                onStart={toggleOpen}
                params={[threshold, approveBountyProposal.current, approveBountyProposal.current.length]}
                tx={api.tx[councilMod].propose}
              />
              <TxButton
                accountId={accountId}
                icon='ban'
                isDisabled={false}
                label={t('Reject')}
                onStart={toggleOpen}
                params={[threshold, closeBountyProposal.current, closeBountyProposal.current.length]}
                tx={api.tx[councilMod].propose}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(BountyInitiateVoting);
