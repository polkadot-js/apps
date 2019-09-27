// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TreasuryProposal as TreasuryProposalType } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useContext, useEffect, useState } from 'react';
import { InputAddress, Labelled, Static } from '@polkadot/react-components';
import { ApiContext } from '@polkadot/react-api';
import { Option } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

import Inset, { InsetProps } from './Inset';
import translate from './translate';

interface Props extends I18nProps {
  className?: string;
  asInset?: boolean;
  insetProps?: Partial<InsetProps>;
  onClick?: () => void;
  proposalId?: string;
  proposal?: TreasuryProposalType | null;
  withLink?: boolean;
}

function TreasuryProposal ({ className, asInset, insetProps, onClick, proposal, proposalId, t }: Props): React.ReactElement<Props> | null {
  const [stateProposal, setProposal] = useState<TreasuryProposalType | null>(null);
  const { api } = useContext(ApiContext);

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
        {formatBalance(value)}
      </Static>
      <Static label={t('bond')}>
        {formatBalance(bond)}
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

export default translate(TreasuryProposal);
