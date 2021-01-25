// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { adjustComponentToUserRole, truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useUserRole } from '../hooks/useUserRole';
import { useTranslation } from '../translate';
import { DisplaySlashCuratorType } from '../types';

interface Props {
  blocksUntilUpdate?: BN;
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}
interface ComponentDescriptions {
  buttonName: string;
  filter: string[];
  header: string;
  helpMessage: string;
  params: any[] | (() => any[]) | undefined;
  tip: string;
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

  const userRole = useUserRole(curatorId);

  const displayComponentAs = adjustComponentToUserRole(userRole, status, blocksUntilUpdate);

  useEffect((): void => {
    members && setThreshold(
      new BN(Math.ceil(members.length * getTreasuryProposalThreshold(api)))
    );
  }, [api, members]);

  const unassignCuratorProposal = useMemo(() => unassignCurator(index), [index, unassignCurator]);

  const outputs = useMemo<Record<DisplaySlashCuratorType, ComponentDescriptions>>(() => ({
    GiveUp: {
      buttonName: t('Give Up'),
      filter: [curatorId.toString()],
      header: t('With this action you will give up on a Curator role.'),
      helpMessage: t("The Curator account that will give up on it's role"),
      params: [index],
      tip: t('You are giving up your curator role, bounty will return to funded state. You will get your deposit back.'),
      tx: unassignCurator
    },
    Hide: {
      buttonName: '',
      filter: [''],
      header: t(''),
      helpMessage: '',
      params: [],
      tip: '',
      tx: api.tx.council.propose
    },
    SlashCuratorAction: {
      buttonName: t('Slash Curator'),
      filter: allAccounts,
      header: t('This action will Slash the Curator.'),
      helpMessage: t('The Curator that will be slashed.'),
      params: [index],
      tip: t("Curator's deposit will be slashed and curator will be unassigned. Bounty will return to funded state."),
      tx: unassignCurator
    },
    SlashCuratorMotion: {
      buttonName: t('Slash Curator'),
      filter: members,
      header: t('This action will create a Council motion to Slash the Curator.'),
      helpMessage: t('The Curator that will be slashed.'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      tip: t("Curator's deposit will be slashed and curator will be unassigned. Bounty will return to funded state."),
      tx: api.tx.council.propose
    },
    UnassignCurator: {
      buttonName: t('Unassign Curator'),
      filter: members,
      header: t('This action will create a Council motion to unassign the Curator.'),
      helpMessage: t('The Curator that will be unassigned'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      tip: t('Curator will be unassigned. Bounty will return to funded state.'),
      tx: api.tx.council.propose
    }
  }), [t, curatorId, index, unassignCurator, api.tx.council.propose, allAccounts, members, threshold, unassignCuratorProposal]);

  const isVotingInitiated = useMemo(() => proposals?.filter(({ proposal }) => BOUNTY_METHODS.includes(proposal.method)).length !== 0, [proposals]);

  const { buttonName, filter, header, helpMessage, params, tip, tx } = outputs[displayComponentAs];

  return (displayComponentAs !== 'Hide') && !isVotingInitiated
    ? (
      <>
        <Button
          icon='user-slash'
          label={buttonName}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>(`Slash Curator from "${truncateTitle(description, 30)}"`)}
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
                  <p>{t<string>('The account that will create this transaction.')}</p>
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
