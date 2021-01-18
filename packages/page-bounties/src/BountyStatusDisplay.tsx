// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import { useTranslation } from '@polkadot/app-bounties/translate';
import VotingDescription from '@polkadot/app-bounties/VotingDescription';
import { LabelHelp } from '@polkadot/react-components';

type Props = {
  bountyStatus: string;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyStatusDisplay ({ bountyStatus, proposals, status }: Props) {
  const { t } = useTranslation();

  const statusHelpMessages: Record<string, string> = useMemo(() => ({
    Active: t('This bounty has received general approval and is currently being implemented.'),
    Approved: t("This bounty was approved by the council, it will get funded after treasury's send period."),
    CuratorProposed: t('The voting for a curator is in progress.'),
    Funded: t('This bounty was approved and funded by council.'),
    PendingPayout: t('This bounty was completed and the beneficiary was awarded by the curator.'),
    Proposed: t('After a bounty was proposed the council decides whether to fund it or not.')
  }), [t]);

  return (
    <>
      <div>
        {bountyStatus}
        <LabelHelp
          help={statusHelpMessages[status.type]}
        />
      </div>
      {proposals && (
        <div>
          <VotingDescription
            proposals={proposals}
            status={status}
          />
        </div>
      )}
    </>
  );
}

export default React.memo(BountyStatusDisplay);
