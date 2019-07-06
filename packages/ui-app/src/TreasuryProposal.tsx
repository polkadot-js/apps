// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { Option, TreasuryProposal as TreasuryProposalType } from '@polkadot/types';

import React from 'react';
import { InputAddress, Inset, Labelled, Static } from '@polkadot/ui-app';
import { withMulti, withApi } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & ApiProps & {
  className?: string,
  inset?: boolean,
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
    const { className, inset, onClick, withLink, t } = this.props;
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
            value={proposer}
            withLabel={false}
          />
        </Labelled>
        <Labelled label={t('beneficiary')}>
          <InputAddress
            isDisabled
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

    if (inset) {
      return (
        <Inset
          className={className}
          href={withLink ? '/treasury' : null}
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
        });
    }
  }
}

export default withMulti(
  TreasuryProposal,
  translate,
  withApi
);
