/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCalls } from '@polkadot/ui-api';
import { CardGrid } from '@polkadot/ui-app';

import Proposal from './Proposal';
import Propose from './Propose';
import translate from '../translate';

<<<<<<< HEAD:packages/app-collective/src/Proposals/index.tsx
type Props = I18nProps & {
  collective_proposals?: Array<Hash>
};

class Proposals extends React.PureComponent<Props> {
  render () {
=======
interface Props extends I18nProps {
  collective_proposals?: Hash[];
}

class Proposals extends React.PureComponent<Props> {
  public render (): React.ReactNode {
>>>>>>> 83babcdae5f02ee1146447f89882efa5529a0030:packages/app-collective/src/Proposals/index.tsx
    const { t } = this.props;

    return (
      <CardGrid
        emptyText={t('No proposals')}
        headerText={t('Proposals')}
        buttons={
          <Propose />
        }
      >
        {this.renderProposals()}
      </CardGrid>
    );
  }

<<<<<<< HEAD:packages/app-collective/src/Proposals/index.tsx
  private renderProposals () {
    const { collective_proposals = [] } = this.props;

    return collective_proposals.map((hash) => (
=======
  private renderProposals (): React.ReactNode {
    const { collective_proposals = [] } = this.props;

    return collective_proposals.map((hash: Hash): React.ReactNode => (
>>>>>>> 83babcdae5f02ee1146447f89882efa5529a0030:packages/app-collective/src/Proposals/index.tsx
      <Proposal
        hash={hash.toHex()}
        key={hash.toHex()}
      />
    ));
  }
}

export default translate(
  withCalls<Props>(
    'query.collective.proposals'
  )(Proposals)
);
