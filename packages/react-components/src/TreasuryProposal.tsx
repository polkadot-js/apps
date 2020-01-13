// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TreasuryProposal as TreasuryProposalType } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { InputAddress, Labelled, Static } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { FormatBalance } from '@polkadot/react-query';

import Inset, { InsetProps } from './Inset';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  asInset?: boolean;
  insetProps?: Partial<InsetProps>;
  onClick?: () => void;
  proposalId?: string;
  proposal?: TreasuryProposalType | null;
  withLink?: boolean;
}

export default function TreasuryProposal ({ className, asInset, insetProps, onClick, proposal, proposalId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [stateProposal, setProposal] = useState<TreasuryProposalType | null>(null);
  const { api } = useApi();

  useEffect((): void => {
    if (!proposal && proposalId) {
      api.query.treasury
        .proposals<Option<TreasuryProposalType>>(proposalId)
        .then((proposal): TreasuryProposalType | null => proposal.unwrapOr(null))
        .catch((): null => null)
        .then(setProposal);
    } else {
      setProposal(proposal || null);
    }
  }, [proposal, proposalId]);

  if (!stateProposal) {
    return null;
  }

  const { bond, beneficiary, proposer, value } = stateProposal;

  const inner = (
    <>
      <Labelled label={t('proposed by')}>
        <InputAddress
          isDisabled
          defaultValue={proposer}
          value={proposer}
          withLabel={false}
        />
      </Labelled>
      <Labelled label={t('beneficiary')}>
        <InputAddress
          isDisabled
          defaultValue={beneficiary}
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

  if (asInset) {
    return (
      <Inset
        className={className}
        {...insetProps}
      >
        {inner}
      </Inset>
    );
  }

  return (
    <div
      className={className}
      onClick={onClick && onClick}
    >
      {inner}
    </div>
  );
}
