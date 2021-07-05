// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCollectiveInstance, useCollectiveMembers } from '@polkadot/react-hooks';

import { truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';
import { ValidUnassignCuratorAction } from '../types';

interface Props {
  action: ValidUnassignCuratorAction;
  curatorId: AccountId;
  description: string;
  index: BountyIndex;
  toggleOpen: () => void;
}

interface ActionProperties {
  filter: string[];
  header: string;
  helpMessage: string;
  params: any[] | (() => any[]) | undefined;
  proposingAccountTip: string;
  tip: string;
  title: string;
  tx: null | ((...args: any[]) => SubmittableExtrinsic<'promise'>);
}

function SlashCurator ({ action, curatorId, description, index, toggleOpen }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { members } = useCollectiveMembers('council');
  const councilMod = useCollectiveInstance('council');
  const { unassignCurator } = useBounties();
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
    SlashCuratorAction: {
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
      filter: members,
      header: t('This action will create a Council motion to slash the Curator.'),
      helpMessage: t('The Curator that will be slashed.'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      proposingAccountTip: t('The council member that will create the motion, submission equates to an "aye" vote.'),
      tip: t("If the motion is approved, Curator's deposit will be slashed and Curator will be unassigned. Bounty will return to the Funded state."),
      title: t('Slash curator'),
      tx: councilMod && api.tx[councilMod].propose
    },
    UnassignCurator: {
      filter: members,
      header: t('This action will create a Council motion to unassign the Curator.'),
      helpMessage: t('The Curator that will be unassigned'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      proposingAccountTip: t('The council member that will create the motion, submission equates to an "aye" vote.'),
      tip: t('If the motion is approved, the current Curator will be unassigned and the Bounty will return to the Funded state.'),
      title: t('Unassign curator'),
      tx: councilMod && api.tx[councilMod].propose
    }
  }), [t, index, unassignCurator, api, allAccounts, councilMod, members, threshold, unassignCuratorProposal]);

  const { filter, helpMessage, params, proposingAccountTip, tip, title, tx } = actionProperties[action];

  if (!tx) {
    return null;
  }

  return (
    <Modal
      header={`${title} - "${truncateTitle(description, 30)}"`}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={proposingAccountTip}>
          <InputAddress
            filter={filter}
            help={t<string>('The account that will sign the transaction.')}
            label={t<string>('proposing account')}
            onChange={setAccountId}
            type='account'
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns hint={tip}>
          <InputAddress
            defaultValue={curatorId}
            help={helpMessage}
            isDisabled
            label={t<string>('current curator')}
            withLabel
          />
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
  );
}

export default React.memo(SlashCurator);
