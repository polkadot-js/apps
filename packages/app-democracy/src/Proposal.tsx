// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxProposal } from '@polkadot/ui-react-rx/ApiObservable/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  value: RxProposal
};

class Proposal extends React.PureComponent<Props> {
  render () {
    const { className, style, value } = this.props;

    return (
      <Item
        className={classes('democracy--Proposal', className)}
        idNumber={value.id}
        proposal={value.proposal}
        proposalExtra={this.renderExtra()}
        style={style}
      >
        {this.renderVoting()}
      </Item>
    );
  }

  private renderExtra () {
    return 'extra extrinsic stuff goes here';
  }

  private renderVoting () {
    return 'extra seconding stuff goes here';
  }
}

export default withMulti(
  Proposal,
  translate,
  withObservable('democracyProposals')
);
