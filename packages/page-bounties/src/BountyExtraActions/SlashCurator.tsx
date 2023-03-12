// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';

import { getTreasuryProposalThreshold } from '@polkadot/apps-config';
import { InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCollectiveInstance, useCollectiveMembers } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { truncateTitle } from '../helpers/index.js';
import { useBounties } from '../hooks/index.js';
import { useTranslation } from '../translate.js';
import { ValidUnassignCuratorAction } from '../types.js';

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
  params: unknown[] | (() => unknown[]) | undefined;
  proposingAccountTip: string;
  tip: string;
  title: string;
  tx: null | SubmittableExtrinsicFunction<'promise'>;
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
      header: t<string>('This action will Slash the Curator.'),
      params: [index],
      proposingAccountTip: t<string>('The account that will create the transaction.'),
      tip: t("Curator's deposit will be slashed and curator will be unassigned. Bounty will return to the Funded state."),
      title: t<string>('Slash curator'),
      tx: unassignCurator
    },
    SlashCuratorMotion: {
      filter: members,
      header: t<string>('This action will create a Council motion to slash the Curator.'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      proposingAccountTip: t<string>('The council member that will create the motion, submission equates to an "aye" vote.'),
      tip: t("If the motion is approved, Curator's deposit will be slashed and Curator will be unassigned. Bounty will return to the Funded state."),
      title: t<string>('Slash curator'),
      tx: councilMod && api.tx[councilMod].propose
    },
    UnassignCurator: {
      filter: members,
      header: t<string>('This action will create a Council motion to unassign the Curator.'),
      params: [threshold, unassignCuratorProposal, unassignCuratorProposal?.length],
      proposingAccountTip: t<string>('The council member that will create the motion, submission equates to an "aye" vote.'),
      tip: t<string>('If the motion is approved, the current Curator will be unassigned and the Bounty will return to the Funded state.'),
      title: t<string>('Unassign curator'),
      tx: councilMod && api.tx[councilMod].propose
    }
  }), [t, index, unassignCurator, api, allAccounts, councilMod, members, threshold, unassignCuratorProposal]);

  const { filter, params, proposingAccountTip, tip, title, tx } = actionProperties[action];

  if (!tx) {
    return null;
  }

  return (
    <Modal
      header={`${title} - "${truncateTitle(description, 30)}"`}
      onClose={toggleOpen}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={proposingAccountTip}>
          <InputAddress
            filter={filter}
            label={t<string>('proposing account')}
            onChange={setAccountId}
            type='account'
            withLabel
          />
        </Modal.Columns>
        <Modal.Columns hint={tip}>
          <InputAddress
            defaultValue={curatorId}
            isDisabled
            label={t<string>('current curator')}
            withLabel
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
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
