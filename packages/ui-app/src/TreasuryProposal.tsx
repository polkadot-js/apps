// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { Option, TreasuryProposal as TreasuryProposalType } from '@polkadot/types';

import React from 'react';
import { InputAddress, Labelled, Static } from '@polkadot/ui-app';
import { withMulti, withApi } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import Inset, { InsetProps } from './Inset';
import translate from './translate';

type Props = I18nProps & ApiProps & {
  className?: string,
  asInset?: boolean,
  insetProps?: Partial<InsetProps>,
  onClick?: () => void,
  proposalId: string,
  proposal?: TreasuryProposalType | null,
  withLink?: boolean
};

type State = {
  proposal?: TreasuryProposalType | null
};

class TreasuryProposal extends React.PureComponent<Props, State> {
  state: State = {};

  constructor (props: Props) {
    super(props);

    if (!props.proposal) {
      this.fetchProposal();
    }
  }

  static getDerivedStateFromProps ({ proposal }: Props, state: State) {
    if (!state.proposal && proposal) {
      return { proposal };
    }
    return null;
  }

  componentDidUpdate () {
    this.fetchProposal();
  }

  render () {
    const { className, asInset, insetProps, onClick, t } = this.props;
    const { proposal } = this.state;

    if (!proposal) {
      return null;
    }

    const { bond, beneficiary, proposer, value } = proposal;

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

  private fetchProposal = () => {
    const { api, proposalId } = this.props;

    if (!this.state.proposal && proposalId) {
      api.query.treasury.proposals(proposalId)
        .then((proposal) => {
          this.setState({
            proposal: (proposal as Option<TreasuryProposalType>).unwrapOr(null)
          });
        })
        .catch(() => {
          console.error('Error fetching proposal');
        });
    }
  }
}

export default withMulti(
  TreasuryProposal,
  translate,
  withApi
);
