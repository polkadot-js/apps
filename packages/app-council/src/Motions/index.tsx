/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { CardGrid } from '@polkadot/react-components';

import Motion from './Motion';
import Propose from './Propose';
import translate from '../translate';

interface Props extends I18nProps {
  council_proposals?: Hash[];
}

class Proposals extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { t } = this.props;

    return (
      <CardGrid
        emptyText={t('No council motions')}
        headerText={t('Motions')}
        buttons={
          <Propose />
        }
      >
        {this.renderProposals()}
      </CardGrid>
    );
  }

  private renderProposals (): React.ReactNode {
    const { council_proposals = [] } = this.props;

    return council_proposals.map((hash: Hash): React.ReactNode => (
      <Motion
        hash={hash.toHex()}
        key={hash.toHex()}
      />
    ));
  }
}

export default translate(
  withCalls<Props>(
    'query.council.proposals'
  )(Proposals)
);
