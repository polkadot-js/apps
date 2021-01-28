// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { determineUnassignCuratorAction, truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useUserRole } from '../hooks/useUserRole';
import { useTranslation } from '../translate';
import { ValidUnassignCuratorAction } from '../types';

interface Props {
  blocksUntilUpdate?: BN;
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

interface ActionProperties {
  buttonName: string;
  filter: string[];
  header: string;
  helpMessage: string;
  params: any[] | (() => any[]) | undefined;
  proposingAccountTip: string;
  tip: string;
  title: string;
  tx: ((...args: any[]) => SubmittableExtrinsic<'promise'>);
}

const BOUNTY_METHODS = ['unassignCurator'];

function SlashCurator ({ blocksUntilUpdate, curatorId, description, index, proposals, status }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { members } = useMembers();
  const { unassignCurator } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<BN>();
  const { allAccounts } = useAccounts();

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const unassignCuratorProposal = useMemo(() => unassignCurator(index), [index, unassignCurator]);

  const actionProperties = useMemo<Record<ValidUnassignCuratorAction, ActionProperties>>(() => ({
    GiveUp: {
      buttonName: t('Give Up'),
      filter: [curatorId.toString()],
      header: t('This action will unassign you from a curator role.'),
      helpMessage: t("The Curator account that will give up on it's role"),
      params: [index],
      proposingAccountTip: t('The account that will create the transaction.'),
      tip: t('You are giving up your curator role, the bounty will return to the Funded state. You will get your deposit back.'),
      title: t("Give up curator's role"),
      tx: unassignCurator
    },
    SlashCuratorAction: {
      buttonName: t('Slash Curator'),
      filter: allAccounts,
      header: t('This action will Slash the Curator.'),
      helpMessage: t('The Curator that will be slashed.'),
      params: [index],
      proposingAccountTip: t('The account that will create the transaction.'),
      tip: t("Curator's deposit will be slashed and curator will be unassigned. Bounty will return to the Funded state."),
      title: t('Slash curator'),
      tx: unassignCurator
    },
    SlashCuratorMotion: {
      buttonName: t('Slash Curator'),
      filter: members,
      header: t('This action will create a Council motion to slash the Curator.'),
      helpMessage: t('The Curator that will be slashed.'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      proposingAccountTip: t('The council member that will create the motion, submission equates to an "aye" vote.'),
      tip: t("If the motion is outvoted, Curator's deposit will be slashed and Curator will be unassigned. Bounty will return to the Funded state."),
      title: t('Slash curator'),
      tx: api.tx.council.propose
    },
    UnassignCurator: {
      buttonName: t('Unassign Curator'),
      filter: members,
      header: t('This action will create a Council motion to unassign the Curator.'),
      helpMessage: t('The Curator that will be unassigned'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      proposingAccountTip: t('The council member that will create the motion, submission equates to an "aye" vote.'),
      tip: t('If the motion is outvoted, the current Curator will be unassigned and the Bounty will return to the Funded state.'),
      title: t('Unassign curator'),
      tx: api.tx.council.propose
    }
  }), [t, curatorId, index, unassignCurator, api.tx.council.propose, allAccounts, members, threshold, unassignCuratorProposal]);

  const isVotingInitiated = useMemo(() => proposals?.filter(({ proposal }) => BOUNTY_METHODS.includes(proposal.method)).length !== 0, [proposals]);

  const userRole = useUserRole(curatorId);

  const action = determineUnassignCuratorAction(userRole, status, blocksUntilUpdate);

  if (action === 'None') {
    return null;
  }

  const { buttonName, filter, header, helpMessage, params, proposingAccountTip, tip, title, tx } = actionProperties[action];

  return !isVotingInitiated
    ? (
      <>
        <Button
          icon='user-slash'
          label={buttonName}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={`${title} - "${truncateTitle(description, 30)}"`}
            size='large'
          >
            <Modal.Content>
              <Modal.Column>
                <p>{header}</p>
              </Modal.Column>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={filter}
                    help={t<string>('The account that will sign the transaction.')}
                    label={t<string>('proposing account')}
                    onChange={setAccountId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{proposingAccountTip}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    defaultValue={curatorId}
                    help={helpMessage}
                    isDisabled
                    label={t<string>('current curator')}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{tip}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='check'
                label='Approve'
                onStart={toggleOpen}
                params={params}
                tx={tx}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(SlashCurator);
