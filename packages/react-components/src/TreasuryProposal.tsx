// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { TreasuryProposal as TreasuryProposalType } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import InputAddress from './InputAddress/index.js';
import Labelled from './Labelled.js';
import Static from './Static.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  onClick?: () => void;
  proposalId?: string;
  proposal?: TreasuryProposalType | null;
  withLink?: boolean;
}

function TreasuryProposal ({ className = '', onClick, proposal, proposalId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [stateProposal, setProposal] = useState<TreasuryProposalType | null>(null);
  const { api } = useApi();

  useEffect((): void => {
    if (!proposal && proposalId) {
      api.query.treasury
        .proposals<Option<TreasuryProposalType>>(proposalId)
        .then((proposal): TreasuryProposalType | null => proposal.unwrapOr(null))
        .catch((): null => null)
        .then(setProposal)
        .catch(console.error);
    } else {
      setProposal(proposal || null);
    }
  }, [api, proposal, proposalId]);

  if (!stateProposal) {
    return null;
  }

  const { beneficiary, bond, proposer, value } = stateProposal;

  const inner = (
    <>
      <Labelled label={t('proposed by')}>
        <InputAddress
          defaultValue={proposer}
          isDisabled
          value={proposer}
          withLabel={false}
        />
      </Labelled>
      <Labelled label={t('beneficiary')}>
        <InputAddress
          defaultValue={beneficiary}
          isDisabled
          value={beneficiary}
          withLabel={false}
        />
      </Labelled>
      <Static label={t('value')}>
        <FormatBalance value={value} />
      </Static>
      <Static label={t('bond')}>
        <FormatBalance value={bond} />
      </Static>
    </>
  );

  return (
    <div
      className={className}
      onClick={onClick && onClick}
    >
      {inner}
    </div>
  );
}

export default React.memo(TreasuryProposal);
